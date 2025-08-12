import { Body, Controller, Post } from '@nestjs/common';
import * as shared from '@ecommerce/shared';
import { AuthService } from './auth.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Kafka Event Handlers
  @EventPattern(shared.KAFKA_EVENTS.USER_UPDATED)
  async handleUserUpdated(
    @Payload() data: shared.UserUpdateFromAuthEvent,
  ): Promise<void> {
    await this.authService.updateUserFromEvent(data);
  }

  @EventPattern(shared.KAFKA_EVENTS.USER_DELETED)
  async handleUserDeleted(
    @Payload() data: shared.UserUpdateFromAuthEvent,
  ): Promise<void> {
    await this.authService.deleteUserFromEvent(data);
  }

  // HTTP Endpoints
  @Post('signup')
  async signup(
    @Body() createUserDto: shared.CreateUserDto,
  ): Promise<shared.SignupResponseDto> {
    return this.authService.signup(createUserDto.email, createUserDto.password);
  }

  @Post('signin')
  async signin(
    @Body() loginDto: shared.LoginDto,
  ): Promise<shared.LoginResponseDto> {
    return this.authService.signin(loginDto.email, loginDto.password);
  }
}
