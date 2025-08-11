import {
  Controller,
  Get,
  Put,
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
import type {
  UserCreatedEvent,
  AuthenticatedRequest,
  UserLookupRequestEvent,
} from '@ecommerce/shared';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Kafka Event Handlers
  @EventPattern(KAFKA_EVENTS.USER_CREATED)
  async handleUserCreated(@Payload() data: UserCreatedEvent): Promise<void> {
    await this.usersService.createUserFromEvent(data);
  }

  @MessagePattern(KAFKA_EVENTS.USER_LOOKUP_REQUEST)
  async handleUserLookupRequest(@Payload() data: UserLookupRequestEvent) {
    console.log(data);
    return this.usersService.handleUserLookupRequest(data);
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
}
