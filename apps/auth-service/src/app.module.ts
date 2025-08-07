import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './auth/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
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
      isGlobal: true, // نجعل الكاش متاح على مستوى التطبيق كامل
      useFactory: () => ({
        store: redisStore, // استخدام redis store
        host: 'redis', // الاسم في docker-compose
        port: 6379,
        ttl: 10, // وقت صلاحية الكاش (ثواني)
      }),
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
