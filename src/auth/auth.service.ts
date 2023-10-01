import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from 'src/users/users.repository';
import { Payload } from './auth.interface';
import { UserDto } from 'src/users/users.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async getJWT(
    userId: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.kakaoValidateUser(userId);
    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);
    return { accessToken, refreshToken };
  }

  async kakaoValidateUser(userId: string): Promise<UserDto> {
    let user: UserDto = await this.usersRepository.getUser(userId);
    if (!user) {
      user = await this.usersRepository.create(userId);
    }
    return user;
  }

  generateAccessToken(user: UserDto): string {
    const payload: Payload = {
      userId: user.userId,
    };
    return this.jwtService.sign(payload);
  }

  async generateRefreshToken(user: UserDto): Promise<string> {
    const payload: Payload = {
      userId: user.userId,
    };

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
    });

    const currentRefreshToken = bcrypt.hashSync(refreshToken, 10);

    await this.usersRepository.setCurrentRefreshToken(
      payload.userId,
      currentRefreshToken,
    );

    return refreshToken;
  }

  async refresh(refreshToken: string): Promise<string> {
    try {
      const decodedRefreshToken = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      }) as Payload;
      const userId = decodedRefreshToken.userId;

      const user =
        await this.usersRepository.getUserWithCurrentRefreshToken(userId);

      const isRefreshTokenMatching = bcrypt.compareSync(
        refreshToken,
        user.currentRefreshToken,
      );

      if (!isRefreshTokenMatching) {
        throw new UnauthorizedException('Invalid refresh-token');
      }

      // Generate new access token
      const accessToken = this.generateAccessToken(user);

      return accessToken;
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh-token');
    }
  }

  async logout(userId: string): Promise<void> {
    await this.usersRepository.logout(userId);
    return;
  }
}
