import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly userService: UserService,
  ) {}

  async kakaoLogin(code: string) {
    const kakao_api_url =
      `https://kauth.kakao.com/oauth/token` +
      `?grant_type=authorization_code` +
      `&client_id=${this.configService.get<string>('KAKAO_CLIENT_ID')}` +
      `&redirect_uri=${this.configService.get<string>(
        'BACKEND_URL',
      )}/auth/kakao` +
      `&code=${code}`;

    await this.httpService.post(kakao_api_url).subscribe((res) => {
      this.httpService
        .post('https://kapi.kakao.com/v2/user/me', null, {
          headers: {
            Authorization: `Bearer ${res.data.access_token}`,
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        })
        .subscribe(async (res) => {
          const id = res.data.id;
          const user = await this.userService.findUser(id);
          console.log(user);
          if (!user) {
            this.userService.create({
              id: id,
              provider: 'kakao',
            });
            console.log('생성');
          } else {
            console.log('이미있음');
          }
        });
    });
    return 'kakao';
  }
}
