import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUserDto } from './dto/user.dto';

interface SignupDto {
  email: string;
  password: string;
  name?: string;
}

interface SigninDto {
  email: string;
  password: string;
}

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: SignupDto) {
    return this.authService.signup(body.email, body.password, body.name);
  }

  @Post('signin')
  async signin(@Body() body: SigninDto) {
    return this.authService.signin(body.email, body.password);
  }
}
