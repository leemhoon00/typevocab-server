import {
  Controller,
  Put,
  Post,
  Get,
  Delete,
  UseGuards,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
  Body,
  HttpCode,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import { UserDto, UpdateUserInfoDto } from './users.dto';
import {
  ApiTags,
  ApiCookieAuth,
  ApiUnauthorizedResponse,
  ApiBody,
  ApiOperation,
  ApiConsumes,
  ApiBadRequestResponse,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('users')
@ApiCookieAuth('jwt')
@ApiUnauthorizedResponse({ description: 'unauthorized - jwt 토큰 인증 실패' })
@ApiBadRequestResponse({ description: 'badRequest - api 요청 형식 안맞음' })
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '유저 정보 가져오기' })
  @ApiResponse({
    status: 200,
    description: '유저 정보 가져오기 성공',
    type: UserDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(200)
  async getUserInfo(@Req() req: Request): Promise<UserDto> {
    return await this.usersService.getUserInfo(req.user.userId);
  }

  @ApiOperation({ summary: '유저 정보 수정하기' })
  @ApiBody({ type: UpdateUserInfoDto, description: '유저 정보' })
  @ApiResponse({ status: 204, description: '유저 정보 수정 성공' })
  @UseGuards(JwtAuthGuard)
  @Put()
  @HttpCode(204)
  async updateUserInfo(
    @Req() req: Request,
    @Body() updateUserInfoDto: UpdateUserInfoDto,
  ): Promise<void> {
    await this.usersService.updateUserInfo(req.user.userId, updateUserInfoDto);
    return;
  }

  @ApiOperation({ summary: '유저 정보 삭제하기' })
  @ApiResponse({ status: 204, description: '유저 정보 삭제 성공' })
  @UseGuards(JwtAuthGuard)
  @Delete()
  @HttpCode(204)
  async delete(@Req() req: Request, @Res() res: Response) {
    await this.usersService.deleteUser(req.user.userId);
    res.clearCookie('jwt');
    res.clearCookie('isLoggedIn');
    return res.send();
  }

  @ApiOperation({ summary: '유저 프로필 이미지 업로드' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: '이미지 파일' })
  @ApiResponse({ status: 201, description: '업로드 성공' })
  @UseGuards(JwtAuthGuard)
  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfileImage(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    return await this.usersService.uploadProfileImage(req.user.userId, file);
  }

  @ApiOperation({ summary: '유저 프로필 이미지 리셋' })
  @ApiResponse({ status: 204, description: '이미지 삭제 성공' })
  @UseGuards(JwtAuthGuard)
  @Delete('image')
  @HttpCode(204)
  async deleteProfileImage(@Req() req: Request): Promise<void> {
    return await this.usersService.deleteProfileImage(req.user.userId);
  }

  @ApiOperation({ summary: '좋아요 개수 (캐싱 예정)' })
  @ApiResponse({
    status: 200,
    description: '좋아요 개수 가져오기 성공',
    type: Number,
  })
  @UseGuards(JwtAuthGuard)
  @Get('likes')
  @HttpCode(200)
  async getLikesCount(): Promise<number> {
    return await this.usersService.getLikesCount();
  }

  @ApiOperation({ summary: '좋아요' })
  @ApiResponse({ status: 201, description: '좋아요' })
  @UseGuards(JwtAuthGuard)
  @Post('likes')
  @HttpCode(201)
  async like(@Req() req: Request): Promise<void> {
    return await this.usersService.like(req.user.userId);
  }

  @ApiOperation({ summary: '좋아요 취소' })
  @ApiResponse({ status: 204, description: '좋아요 취소' })
  @UseGuards(JwtAuthGuard)
  @Delete('likes')
  @HttpCode(204)
  async unlike(@Req() req: Request): Promise<void> {
    return await this.usersService.unlike(req.user.userId);
  }
}
