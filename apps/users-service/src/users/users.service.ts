import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ClientKafka } from '@nestjs/microservices';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import {
  UserCreatedEvent,
  UpdateUserDto,
  UserResponseDto,
  JwtPayload,
  ProfileResponseDto,
  UserLookupRequestEvent,
} from '@ecommerce/shared';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
    @Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka,
  ) {}

  async createUserFromEvent(userData: UserCreatedEvent): Promise<void> {
    if (!userData?.id || !userData.email || !userData.role) {
      console.warn('Received invalid user data:', userData);
      return;
    }

    const { id, email, role } = userData;

    try {
      const existingUser = await this.userRepo.findOne({ where: { email } });

      if (!existingUser) {
        await this.userRepo.save({ id, email, role });
        console.log('User created successfully:', email);
      } else {
        console.log('User already exists, skipping creation:', email);
      }
    } catch (error) {
      console.error(
        'Error creating user:',
        error instanceof Error ? error.message : String(error),
      );
      throw error;
    }
  }

  async getProfile(id: string): Promise<ProfileResponseDto> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate a fresh access token
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const access_token = await this.jwtService.signAsync(payload);

    return {
      ...this.mapToResponse(user),
      access_token,
    };
  }

  async updateProfile(
    id: string,
    updateData: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateData);
    const updatedUser = await this.userRepo.save(user);
    return this.mapToResponse(updatedUser);
  }

  async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.userRepo.find();
    return users.map((user) => this.mapToResponse(user));
  }

  async getUserById(id: string): Promise<UserResponseDto> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.mapToResponse(user);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepo.find();
    return users.map((user) => this.mapToResponse(user));
  }

  async findOne(id: string): Promise<UserResponseDto | null> {
    const user = await this.userRepo.findOne({ where: { id } });
    return user ? this.mapToResponse(user) : null;
  }

  async updateUser(
    id: string,
    updateData: UpdateUserDto,
  ): Promise<UserResponseDto | null> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      return null;
    }

    Object.assign(user, updateData);
    const updatedUser = await this.userRepo.save(user);
    return this.mapToResponse(updatedUser);
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await this.userRepo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async handleUserLookupRequest(
    data: UserLookupRequestEvent,
  ): Promise<UserResponseDto> {
    const user = await this.userRepo.findOne({
      where: { id: data.userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.mapToResponse(user);
  }

  private mapToResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
