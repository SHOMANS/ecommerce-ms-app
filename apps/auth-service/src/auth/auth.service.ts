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
import { AuthUserDto } from './dto/user.dto';

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
    try {
      await this.kafkaClient.connect();
      console.log('Kafka client connected successfully');
    } catch (error) {
      console.warn(
        'Kafka client connection failed, continuing without messaging:',
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async signup(
    email: string,
    password: string,
    name?: string,
  ): Promise<{ user: AuthUserDto; token: string }> {
    // Check if user already exists
    const existingUser = await this.userRepo.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({
      email,
      password: hashedPassword,
      name,
      role: 'user',
    });
    const saved = await this.userRepo.save(user);

    const payload = { sub: saved.id, email: saved.email, role: saved.role };
    const token = await this.jwtService.signAsync(payload);

    try {
      this.kafkaClient.emit('user.created', {
        id: saved.id,
        email: saved.email,
        name: saved.name,
        role: saved.role,
      });
    } catch (error) {
      console.warn(
        'Failed to emit user.created event:',
        error instanceof Error ? error.message : String(error),
      );
    }

    return {
      user: {
        id: saved.id,
        email: saved.email,
        name: saved.name,
        role: saved.role,
      },
      token,
    };
  }

  async signin(
    email: string,
    password: string,
  ): Promise<{ user: AuthUserDto; access_token: string }> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      access_token: token,
    };
  }
}
