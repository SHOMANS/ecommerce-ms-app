import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  CreateUserDto,
  LoginDto,
  LoginResponseDto,
  SignupResponseDto,
  JwtAuthGuard,
} from '@ecommerce/shared';
import type { AuthenticatedRequest } from '@ecommerce/shared';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() createUserDto: CreateUserDto,
  ): Promise<SignupResponseDto> {
    return this.authService.signup(
      createUserDto.email,
      createUserDto.password,
      createUserDto.name,
    );
  }

  @Post('signin')
  async signin(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.signin(loginDto.email, loginDto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: AuthenticatedRequest) {
    return this.authService.getProfile(req.user.userId);
  }
}
