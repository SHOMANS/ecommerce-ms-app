import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  UpdateUserDto,
  UserResponseDto,
  JwtAuthGuard,
  RolesGuard,
  Roles,
} from '@ecommerce/shared';
import type { UserCreatedEvent, AuthenticatedRequest } from '@ecommerce/shared';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Kafka Event Handlers
  @EventPattern('user.created')
  async handleUserCreated(@Payload() data: UserCreatedEvent): Promise<void> {
    await this.usersService.createUserFromEvent(data);
  }

  // HTTP Endpoints
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(
    @Request() req: AuthenticatedRequest,
  ): Promise<UserResponseDto> {
    return this.usersService.getProfile(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(
    @Request() req: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateProfile(req.user.userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('all')
  async getAllUsers(): Promise<UserResponseDto[]> {
    return this.usersService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.getUserById(id);
  }
}
