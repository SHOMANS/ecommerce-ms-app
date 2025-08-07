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
            retries: 3,
            initialRetryTime: 100,
            maxRetryTime: 10000,
          },
          connectionTimeout: 5000,
          requestTimeout: 5000,
        },
        consumer: {
          groupId: 'auth-consumer',
          allowAutoTopicCreation: true,
        },
      },
    });

    // Start both HTTP server and microservice
    await app.startAllMicroservices();
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
