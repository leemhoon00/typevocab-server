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
import { multerOption } from '../common/utils/multer.options';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  get(@Req() req) {
    return this.userService.getUser(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  update(@Req() req) {
    return this.userService.updateUser(req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  delete(@Req() req, @Res() res: Response) {
    return this.userService.deleteUser(req.user.userId, res);
  }

  @UseGuards(JwtAuthGuard)
  @Post('image')
  @UseInterceptors(FileInterceptor('file', multerOption))
  uploadProfileImage(@Req() req, @UploadedFile() file: Express.Multer.File) {
    return this.userService.uploadProfileImage(req.user.userId, file);
  }
}
