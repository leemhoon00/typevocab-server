import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
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
    // Verify refresh token
    // JWT Refresh Token 검증 로직
    try {
      const decodedRefreshToken = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      }) as Payload;
      // Check if user exists
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

  logout(res: Response): void {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.clearCookie('isLoggedIn');
    return res.redirect(this.configService.get('CLIENT_URL'));
  }
}
