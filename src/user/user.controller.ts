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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  get(@Req() req: Request) {
    return this.userService.getUser(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  update(@Req() req: Request) {
    return this.userService.updateUser(req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  delete(@Req() req: Request, @Res() res: Response) {
    return this.userService.deleteUser(req.user.userId, res);
  }

  @UseGuards(JwtAuthGuard)
  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  uploadProfileImage(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.uploadProfileImage(req.user.userId, file);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('image')
  deleteProfileImage(@Req() req: Request) {
    return this.userService.deleteProfileImage(req.user.userId);
  }
}
