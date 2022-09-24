import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private AuthService: AuthService) {}

  @Get('signin')
  singIn() {
    return this.AuthService.singIn();
  }
  @Get('signup')
  singUp() {
    return this.AuthService.singUp();
  }
}
