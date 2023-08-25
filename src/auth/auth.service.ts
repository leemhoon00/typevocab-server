import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async kakaoLogin(id: string, res: Response) {
    let user = await this.userService.findUser(id);
    if (!user) {
      user = await this.userService.create({
        id,
        provider: 'kakao',
      });
      console.log('생성');
    }
    const payload = { id: user.id };
    const token = this.jwtService.sign(payload);
    res.cookie('jwt', token, { httpOnly: true });
    return user;
  }
}
