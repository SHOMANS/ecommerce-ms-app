import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import type {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
} from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async createUserFromEvent(userData: CreateUserDto): Promise<void> {
    if (!userData || !userData.id || !userData.email || !userData.role) {
      console.warn('Received invalid user data:', userData);
      return;
    }

    const { id, email, role, name } = userData;

    try {
      const existingUser = await this.userRepo.findOne({ where: { email } });

      if (!existingUser) {
        await this.userRepo.save({ id, email, name, role });
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

  async getProfile(id: string): Promise<UserResponseDto> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
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
