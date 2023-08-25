import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
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

    const tokenRes = await this.httpService.post(kakao_api_url);
    tokenRes.subscribe((res) => console.log(res.data));
    console.log(tokenRes);
    return 'kakao';
  }
}
