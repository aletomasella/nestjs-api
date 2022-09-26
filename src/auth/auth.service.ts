import { ForbiddenException, Injectable, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  @Post()
  async singIn(data: AuthDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: data.email,
        },
      });

      if (!user) {
        throw new ForbiddenException('Invalid credentials');
      }

      const valid = await argon.verify(user.passHash, data.password);
      if (!valid) {
        throw new ForbiddenException('Invalid credentials');
      }

      return { user };
    } catch (error) {
      throw error;
    }
  }

  async singUp(data: AuthDto) {
    try {
      const hash = await argon.hash(data.password);

      const user = await this.prisma.user.create({
        data: {
          email: data.email,
          passHash: hash,
          username: '',
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });
      return { user };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already in use');
        }
      }
      throw error;
    }
  }
}
