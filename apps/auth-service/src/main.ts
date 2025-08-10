import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // Suppress KafkaJS partitioner warning
  process.env.KAFKAJS_NO_PARTITIONER_WARNING = '1';

  // Create HTTP application for REST API endpoints
  const app = await NestFactory.create(AppModule);

  // Only connect Kafka if it's available (for local development flexibility)
  const kafkaBroker = process.env.KAFKA_BROKERS || 'localhost:9092';

  try {
    // Add Kafka microservice as a hybrid application
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'auth-service',
          brokers: [kafkaBroker],
          retry: {
            retries: 5,
            initialRetryTime: 1000,
            maxRetryTime: 15000,
          },
          connectionTimeout: 30000, // Increased timeout
          requestTimeout: 25000, // Increased timeout
        },
        consumer: {
          groupId: 'auth-consumer',
          allowAutoTopicCreation: true,
        },
      },
    });

    // Start both HTTP server and microservice with timeout
    await Promise.race([
      app.startAllMicroservices(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Kafka connection timeout')), 30000),
      ),
    ]);
    console.log('Kafka microservice connected successfully');
  } catch (error) {
    console.warn(
      'Kafka connection failed, continuing without microservice:',
      error instanceof Error ? error.message : String(error),
    );
  }

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`Auth service is running on port ${port}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start auth service:', error);
  process.exit(1);
});
