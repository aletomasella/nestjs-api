import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private AuthService: AuthService) {}

  @Post('signin')
  singIn(@Body() data: AuthDto) {
    return this.AuthService.singIn(data);
  }
  @Post('signup')
  singUp(@Body() data: AuthDto) {
    return this.AuthService.singUp(data);
  }
}
