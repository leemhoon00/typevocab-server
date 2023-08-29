import {
  Controller,
  Put,
  Get,
  Delete,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
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
}
