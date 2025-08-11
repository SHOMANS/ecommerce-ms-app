import {
  Inject,
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ClientKafka } from '@nestjs/microservices';
import {
  UserCreatedEvent,
  KAFKA_EVENTS,
  LoginResponseDto,
  SignupResponseDto,
  JwtPayload,
  UserResponseDto,
} from '@ecommerce/shared';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,

    @Inject('KAFKA_SERVICE')
    private kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf(KAFKA_EVENTS.USER_LOOKUP_REQUEST);
    await this.kafkaClient.connect();
  }

  async signup(email: string, password: string): Promise<SignupResponseDto> {
    const existingUser = await this.userRepo.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({
      email,
      password: hashedPassword,
      role: 'user',
    });
    const saved = await this.userRepo.save(user);

    const payload: JwtPayload = {
      sub: saved.id,
      email: saved.email,
      role: saved.role,
    };
    const access_token = await this.jwtService.signAsync(payload);

    const userCreatedEvent: UserCreatedEvent = {
      id: saved.id,
      email: saved.email,
      role: saved.role,
      createdAt: new Date(),
    };
    this.kafkaClient.emit(KAFKA_EVENTS.USER_CREATED, userCreatedEvent);

    return {
      user: {
        id: saved.id,
        email: saved.email,
        role: saved.role,
      },
      access_token,
    };
  }

  async signin(email: string, password: string): Promise<LoginResponseDto> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const access_token = await this.jwtService.signAsync(payload);

    try {
      const userData = (await this.kafkaClient
        .send(KAFKA_EVENTS.USER_LOOKUP_REQUEST, { userId: user.id })
        .toPromise()) as UserResponseDto;

      return {
        user: userData,
        access_token,
      };
    } catch {
      // If Kafka fails, return basic user data
      return {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        access_token,
      };
    }
  }
}
