import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './auth/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { HealthController } from './health.controller';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'auth_user',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'auth_service',
      entities: [User],
      synchronize: true, // Set to false in production
      logging: true, // Enable logging for debugging
    }),
    CacheModule.registerAsync({
      isGlobal: true, // Make cache available globally
      useFactory: () => ({
        store: redisStore, // Use redis store
        host: 'redis', // Name in docker-compose
        port: 6379,
        ttl: 10, // Cache TTL in seconds
      }),
    }),
    AuthModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
