import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import {
  UpdateUserDto,
  ProfileResponseDto,
  JwtAuthGuard,
  RolesGuard,
  Roles,
  KAFKA_EVENTS,
} from '@ecommerce/shared';
import type { UserCreatedEvent, AuthenticatedRequest } from '@ecommerce/shared';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Kafka Event Handlers
  @EventPattern(KAFKA_EVENTS.USER_CREATED)
  async handleUserCreated(@Payload() data: UserCreatedEvent): Promise<void> {
    await this.usersService.createUserFromEvent(data);
  }

  // Kafka Message Pattern Handlers (request-response)
  @MessagePattern(KAFKA_EVENTS.USER_LOOKUP_REQUEST)
  async handleUserLookupRequest(@Payload() data: { userId: string }) {
    try {
      return await this.usersService.getUserById(data.userId);
    } catch {
      // Return null if user not found, let auth service handle fallback
      return null;
    }
  }

  // HTTP Endpoints
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(
    @Request() req: AuthenticatedRequest,
  ): Promise<ProfileResponseDto> {
    return this.usersService.getProfile(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(
    @Request() req: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateProfile(req.user.userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('all')
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
