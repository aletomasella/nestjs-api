import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

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

      delete user.passHash;

      return this.signToken(user.id, user.email);
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

  private async signToken(userId: number, email: string) {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET');
    const options = {
      expiresIn: '1d',
      secret,
    };

    const token = await this.jwt.signAsync(payload, options);

    return { access_token: token };
  }
}
