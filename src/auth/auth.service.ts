import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async kakaoLogin(id: string) {
    const user = await this.userService.findUser(id);
    if (!user) {
      const user = this.userService.create({
        id,
        provider: 'kakao',
      });
      console.log('생성');
      return user;
    } else {
      console.log('이미있음');
      return user;
    }
  }
}
