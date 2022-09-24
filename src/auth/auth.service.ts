import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  singIn() {
    return { message: 'Sign in' };
  }

  singUp() {
    return { message: 'Sign up' };
  }
}
