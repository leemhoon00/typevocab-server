import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserDocument } from 'src/users/user.schema';
import { UsersRepository } from 'src/users/users.repository';
import { Payload } from './payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async getJWT(kakaoId: number) {
    const user = await this.kakaoValidateUser(kakaoId);
    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);
    return { accessToken, refreshToken };
  }

  async kakaoValidateUser(kakaoId: number): Promise<UserDocument> {
    let user: UserDocument =
      await this.usersRepository.findUserByKakaoId(kakaoId);
    if (!user) {
      user = await this.usersRepository.create({
        kakaoId,
        provider: 'kakao',
      });
    }
    return user;
  }

  generateAccessToken(user: UserDocument): string {
    const payload: Payload = {
      userId: user._id,
    };
    return this.jwtService.sign(payload);
  }

  async generateRefreshToken(user: UserDocument): Promise<string> {
    const payload: Payload = {
      userId: user._id,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
    });
  }

  async refresh(refreshToken): Promise<string> {
    try {
      const decodedRefreshToken = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      }) as Payload;

      const userId = decodedRefreshToken.userId;
      const user = (await this.usersRepository.getUserInfo(
        userId,
      )) as UserDocument;

      // Generate new access token
      const accessToken = this.generateAccessToken(user);

      return accessToken;
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh-token');
    }
  }
}
