import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  // Suppress KafkaJS partitioner warning
  process.env.KAFKAJS_NO_PARTITIONER_WARNING = '1';

  const logger = new Logger('UsersServiceBootstrap');

  // Create HTTP application for REST API endpoints
  const app = await NestFactory.create(AppModule);

  const kafkaBrokers = process.env.KAFKA_BROKERS?.split(',') || [
    'localhost:9092',
  ];
  let kafkaConnected = false;
  let retryCount = 0;
  const maxRetries = 10;
  const retryDelay = 5000; // 5 seconds

  // Robust Kafka connection with retry logic
  while (!kafkaConnected && retryCount < maxRetries) {
    try {
      retryCount++;
      logger.log(
        `Attempting Kafka connection (attempt ${retryCount}/${maxRetries})...`,
      );

      // Add Kafka microservice as a hybrid application
      app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'users-service',
            brokers: kafkaBrokers,
            retry: {
              retries: 10,
              initialRetryTime: 300,
              maxRetryTime: 30000,
            },
            connectionTimeout: 10000,
            requestTimeout: 10000,
          },
          consumer: {
            groupId: 'users-consumer',
            allowAutoTopicCreation: true,
            retry: {
              retries: 10,
            },
          },
        },
      });

      // Start microservice with timeout
      await Promise.race([
        app.startAllMicroservices(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Connection timeout')), 15000),
        ),
      ]);

      kafkaConnected = true;
      logger.log('Kafka microservice connected successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.warn(
        `Kafka connection attempt ${retryCount} failed: ${errorMessage}`,
      );

      if (retryCount < maxRetries) {
        logger.log(`Retrying in ${retryDelay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      } else {
        logger.error(
          'Failed to connect to Kafka after all retries. Service will run without event consumption.',
        );
      }
    }
  }

  const port = process.env.PORT || 3002;
  await app.listen(port);

  logger.log(`Users service started on port ${port}`);
  logger.log(
    `Kafka connection status: ${kafkaConnected ? 'Connected' : 'Failed'}`,
  );
}

bootstrap().catch((error) => {
  console.error('Failed to start users service:', error);
  process.exit(1);
});
