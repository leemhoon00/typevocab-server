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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserService } from './user.service';
import { Request, Response } from 'express';
import { GetUserDto, UpdateUserDto, FileUploadDto } from './dto/user.dto';
import {
  ApiTags,
  ApiCookieAuth,
  ApiOkResponse,
  ApiHeader,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiMovedPermanentlyResponse,
  ApiBody,
  ApiOperation,
  ApiConsumes,
} from '@nestjs/swagger';

@ApiTags('user')
@ApiCookieAuth('jwt')
@ApiHeader({ name: 'cookie: jwt' })
@ApiUnauthorizedResponse({ description: 'unAuthorization' })
@ApiNotFoundResponse({ description: '404 Not Found' })
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '유저 정보 가져오기' })
  @ApiOkResponse({ description: 'ok', type: GetUserDto })
  @UseGuards(JwtAuthGuard)
  @Get()
  get(@Req() req: Request) {
    return this.userService.getUser(req.user.userId);
  }

  @ApiOperation({ summary: '유저 정보 수정하기' })
  @ApiBody({ type: UpdateUserDto, description: '유저 정보' })
  @ApiOkResponse({ description: 'ok' })
  @UseGuards(JwtAuthGuard)
  @Put()
  update(@Req() req: Request) {
    return this.userService.updateUser(req);
  }

  @ApiOperation({ summary: '유저 정보 삭제하기' })
  @ApiMovedPermanentlyResponse({ description: '홈으로 리다이렉트' })
  @UseGuards(JwtAuthGuard)
  @Delete()
  delete(@Req() req: Request, @Res() res: Response) {
    return this.userService.deleteUser(req.user.userId, res);
  }

  @ApiOperation({ summary: '유저 프로필 이미지 업로드' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: '유저 프로필 이미지', type: FileUploadDto })
  @ApiOkResponse({ description: 'ok' })
  @UseGuards(JwtAuthGuard)
  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  uploadProfileImage(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.uploadProfileImage(req.user.userId, file);
  }

  @ApiOperation({ summary: '유저 프로필 이미지 삭제' })
  @ApiOkResponse({ description: 'ok' })
  @UseGuards(JwtAuthGuard)
  @Delete('image')
  deleteProfileImage(@Req() req: Request) {
    return this.userService.deleteProfileImage(req.user.userId);
  }
}
