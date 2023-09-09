import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  UseGuards,
  Req,
  Res,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request, Response } from 'express';
import { VocabService } from './vocab.service';

@Controller('vocab')
export class VocabController {
  constructor(private readonly vocabService: VocabService) {}
  @UseGuards(JwtAuthGuard)
  @Post('folder')
  async createFolder(@Req() req: Request, @Body() body) {
    return this.vocabService.createFolder(req.user._id, body.folderName);
  }

  @UseGuards(JwtAuthGuard)
  @Get('folder')
  async getFolders(@Req() req: Request) {
    return this.vocabService.getFolders(req.user._id);
  }
}
