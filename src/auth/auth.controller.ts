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
import { Request, Response, CookieOptions } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}
  cookieOptions: CookieOptions = {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    path: '/',
    domain: this.configService.get('COOKIE_DOMAIN'),
  };

  @ApiOperation({ summary: '카카오 로그인' })
  @ApiResponse({
    status: 301,
    description: '로그인 성공 / 홈으로 리다이렉트',
    headers: {
      'Set-Cookie': {
        description: 'accessToken, refreshToken, isLoggedIn',
        schema: {
          type: 'string',
        },
      },
    },
  })
  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  @HttpCode(301)
  async kakaoLogin(@Req() req: Request, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.getJWT(
      req.user.userId,
    );
    res.cookie('accessToken', accessToken, this.cookieOptions);
    res.cookie('refreshToken', refreshToken, this.cookieOptions);
    res.cookie('isLoggedIn', true, {
      httpOnly: false,
      sameSite: 'none',
      secure: true,
      path: '/',
      domain: this.configService.get('COOKIE_DOMAIN'),
    });
    return res.redirect(this.configService.get('CLIENT_URL'));
  }

  @ApiOperation({ summary: '토큰 재발급' })
  @ApiResponse({
    status: 200,
    description: '토큰 재발급 성공',
    headers: {
      'Set-Cookie': {
        description: 'accessToken',
        schema: {
          type: 'string',
        },
      },
    },
  })
  @Get('refresh')
  @HttpCode(200)
  async refresh(@Req() req: Request, @Res() res: Response) {
    try {
      const newAccessToken = await this.authService.refresh(
        req.cookies?.refreshToken,
      );
      res.cookie('accessToken', newAccessToken, this.cookieOptions);
      return res.send();
    } catch (err) {
      res.clearCookie('accessToken', this.cookieOptions);
      res.clearCookie('refreshToken', this.cookieOptions);
      res.clearCookie('isLoggedIn', {
        httpOnly: false,
        sameSite: 'none',
        secure: true,
        path: '/',
        domain: this.configService.get('COOKIE_DOMAIN'),
      });
      throw new UnauthorizedException();
    }
  }

  @ApiOperation({ summary: '로그아웃' })
  @ApiResponse({ status: 301, description: '쿠키 삭제 후 홈으로 리다이렉트' })
  @UseGuards(AuthGuard('jwt'))
  @Get('logout')
  @HttpCode(301)
  async logout(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('accessToken', this.cookieOptions);
    res.clearCookie('refreshToken', this.cookieOptions);
    res.clearCookie('isLoggedIn', {
      httpOnly: false,
      sameSite: 'none',
      secure: true,
      path: '/',
      domain: this.configService.get('COOKIE_DOMAIN'),
    });
    await this.authService.logout(req.user.userId);
    return res.redirect(this.configService.get('CLIENT_URL'));
  }
}
