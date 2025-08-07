import {
  Inject,
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
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
  private readonly logger = new Logger(AuthService.name);
  private isKafkaConnected = false;
  private connectionRetries = 0;
  private maxConnectionRetries = 10;
  private retryDelay = 5000;

  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,

    @Inject('KAFKA_SERVICE')
    private kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.connectToKafkaWithRetry();
  }

  private async connectToKafkaWithRetry(): Promise<void> {
    while (
      !this.isKafkaConnected &&
      this.connectionRetries < this.maxConnectionRetries
    ) {
      try {
        this.connectionRetries++;
        this.logger.log(
          `Attempting Kafka client connection (attempt ${this.connectionRetries}/${this.maxConnectionRetries})...`,
        );

        await Promise.race([
          this.kafkaClient.connect(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Connection timeout')), 10000),
          ),
        ]);

        this.isKafkaConnected = true;
        this.connectionRetries = 0;
        this.logger.log('Kafka client connected successfully');
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        this.logger.warn(
          `Kafka client connection attempt ${this.connectionRetries} failed: ${errorMessage}`,
        );

        if (this.connectionRetries < this.maxConnectionRetries) {
          this.logger.log(
            `Retrying Kafka connection in ${this.retryDelay}ms...`,
          );
          await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
        } else {
          this.logger.error(
            'Failed to connect Kafka client after all retries. Events will not be emitted.',
          );
        }
      }
    }
  }

  private emitEventSafely(
    event: string,
    data: { email?: string; [key: string]: any },
  ): void {
    if (!this.isKafkaConnected) {
      this.logger.warn(`Cannot emit ${event} event: Kafka not connected`);
      return;
    }

    try {
      this.kafkaClient.emit(event, data);
      this.logger.log(
        `Successfully emitted ${event} event for user: ${data.email}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to emit ${event} event:`,
        error instanceof Error ? error.message : String(error),
      );

      // Mark as disconnected and attempt to reconnect
      this.isKafkaConnected = false;
      this.connectionRetries = 0;

      // Attempt to reconnect in background
      setTimeout(() => {
        void this.connectToKafkaWithRetry();
      }, 1000);
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

    // Emit user.created event safely with retry logic
    this.emitEventSafely('user.created', {
      id: saved.id,
      email: saved.email,
      name: saved.name,
      role: saved.role,
    });

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
