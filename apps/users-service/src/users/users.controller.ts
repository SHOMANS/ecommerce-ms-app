import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UsersService } from './users.service';
import type { UserCreatedEvent, AuthenticatedRequest } from './dto/users.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @EventPattern('user.created')
  async handleUserCreated(@Payload() data: UserCreatedEvent): Promise<void> {
    await this.usersService.createUserFromEvent(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: AuthenticatedRequest) {
    return this.usersService.getProfile(req.user.userId);
  }
}
