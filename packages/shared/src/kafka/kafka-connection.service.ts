import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { ClientKafka, MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestApplication } from '@nestjs/core';

export interface KafkaConfig {
  clientId: string;
  groupId: string;
  brokers: string[];
  maxRetries?: number;
  retryDelay?: number;
  connectionTimeout?: number;
  requestTimeout?: number;
}

@Injectable()
export class KafkaConnectionService implements OnApplicationShutdown {
  private readonly logger = new Logger(KafkaConnectionService.name);
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelay = 5000; // Start with 5 seconds
  private maxReconnectDelay = 60000; // Max 1 minute
  private reconnectTimer?: NodeJS.Timeout;

  async connectMicroservice(
    app: NestApplication,
    config: KafkaConfig
  ): Promise<boolean> {
    const microserviceConfig: MicroserviceOptions = {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: config.clientId,
          brokers: config.brokers,
          retry: {
            retries: config.maxRetries || 10,
            initialRetryTime: 300,
            maxRetryTime: 30000,
          },
          connectionTimeout: config.connectionTimeout || 10000,
          requestTimeout: config.requestTimeout || 10000,
        },
        consumer: {
          groupId: config.groupId,
          allowAutoTopicCreation: true,
          retry: {
            retries: 10,
          },
        },
      },
    };

    return this.connectWithRetry(async () => {
      this.logger.log(`Attempting to connect Kafka microservice...`);
      
      app.connectMicroservice(microserviceConfig);
      await app.startAllMicroservices();
      
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.logger.log('Kafka microservice connected successfully');
      return true;
    });
  }

  async connectClient(kafkaClient: ClientKafka): Promise<boolean> {
    return this.connectWithRetry(async () => {
      this.logger.log(`Attempting to connect Kafka client...`);
      
      await kafkaClient.connect();
      
      this.logger.log('Kafka client connected successfully');
      return true;
    });
  }

  private async connectWithRetry(
    connectFn: () => Promise<boolean>,
    attempt = 1
  ): Promise<boolean> {
    try {
      const result = await connectFn();
      if (result) {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        return true;
      }
    } catch (error) {
      this.logger.warn(
        `Kafka connection attempt ${attempt} failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }

    if (attempt >= this.maxReconnectAttempts) {
      this.logger.error(
        `Failed to connect to Kafka after ${this.maxReconnectAttempts} attempts. Giving up.`
      );
      return false;
    }

    const delay = Math.min(
      this.reconnectDelay * Math.pow(2, attempt - 1),
      this.maxReconnectDelay
    );

    this.logger.log(`Retrying Kafka connection in ${delay}ms...`);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return this.connectWithRetry(connectFn, attempt + 1);
  }

  async scheduleReconnect(
    connectFn: () => Promise<boolean>
  ): Promise<void> {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.reconnectTimer = setTimeout(async () => {
      if (!this.isConnected) {
        this.logger.log('Attempting to reconnect to Kafka...');
        await this.connectWithRetry(connectFn);
      }
    }, this.reconnectDelay);
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  setConnectionStatus(status: boolean): void {
    this.isConnected = status;
  }

  async onApplicationShutdown(): Promise<void> {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
  }
}
