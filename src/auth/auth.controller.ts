import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
  HttpCode,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({ summary: '카카오 로그인' })
  @ApiResponse({ status: 301, description: '홈으로 리다이렉트' })
  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  @HttpCode(301)
  async kakaoLogin(@Req() req: Request, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.getJWT(
      req.user.kakaoId,
    );
    res.cookie('accessToken', accessToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    res.cookie('isLoggedIn', true, { httpOnly: false });
    return res.redirect(this.configService.get('CLIENT_URL'));
  }

  @ApiOperation({ summary: '토큰 재발급' })
  @ApiResponse({ status: 200, description: '토큰 재발급 성공' })
  @Get('refresh')
  @HttpCode(200)
  async refresh(@Req() req: Request, @Res() res: Response) {
    try {
      const newAccessToken = await this.authService.refresh(
        req.cookies?.refreshToken,
      );

      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
      });
      return res.send();
    } catch (err) {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      res.clearCookie('isLoggedIn');
      throw new UnauthorizedException();
    }
  }

  @ApiOperation({ summary: '로그아웃' })
  @ApiResponse({ status: 301, description: '홈으로 리다이렉트' })
  @Get('logout')
  @HttpCode(301)
  logout(@Res() res: Response) {
    return this.authService.logout(res);
  }
}
