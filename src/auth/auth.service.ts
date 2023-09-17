import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { UserDocument } from 'src/users/user.schema';

import { UsersRepository } from 'src/users/users.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async kakaoLogin(id: string, res: Response) {
    let user: UserDocument = await this.usersRepository.findUserByKakaoId(id);
    if (!user) {
      user = await this.usersRepository.create({
        id,
        provider: 'kakao',
      });
    }
    const payload = { _id: user._id };
    const token = this.jwtService.sign(payload);
    res.cookie('jwt', token, { httpOnly: true });
    res.cookie('isLoggedIn', true, { httpOnly: false });
    return res.redirect(this.configService.get('CLIENT_URL'));
  }

  logout(res: Response) {
    res.clearCookie('jwt');
    res.clearCookie('isLoggedIn');
    return res.redirect(this.configService.get('CLIENT_URL'));
  }
}
