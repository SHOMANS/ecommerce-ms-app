import { Body, Controller, Post } from '@nestjs/common';
import {
  CreateUserDto,
  LoginDto,
  LoginResponseDto,
  SignupResponseDto,
} from '@ecommerce/shared';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() createUserDto: CreateUserDto,
  ): Promise<SignupResponseDto> {
    return this.authService.signup(createUserDto.email, createUserDto.password);
  }

  @Post('signin')
  async signin(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.signin(loginDto.email, loginDto.password);
  }
}
