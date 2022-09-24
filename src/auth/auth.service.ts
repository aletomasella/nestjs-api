import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  singIn() {
    return { message: 'Sign in' };
  }

  singUp() {
    return { message: 'Sign up' };
  }
}
