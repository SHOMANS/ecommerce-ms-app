import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtAuthGuard } from '@ecommerce/shared';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '1d' },
    }),
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'auth-service-client',
            brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
            retry: {
              retries: 10,
              initialRetryTime: 300,
              maxRetryTime: 30000,
              factor: 2,
              multiplier: 2,
            },
            connectionTimeout: 10000,
            requestTimeout: 10000,
            enforceRequestTimeout: true,
          },
          consumer: {
            groupId: 'auth-service-group',
            allowAutoTopicCreation: true,
            retry: {
              retries: 10,
            },
          },
          producer: {
            allowAutoTopicCreation: true,
            retry: {
              retries: 10,
            },
          },
        },
      },
    ]),
  ],
  providers: [AuthService, JwtAuthGuard],
  controllers: [AuthController],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
