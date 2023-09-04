import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { UserDocument } from 'src/user/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async kakaoLogin(id: string, res: Response) {
    let user: UserDocument = await this.userService.findUserByKakaoId(id);
    if (!user) {
      user = await this.userService.create({
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
