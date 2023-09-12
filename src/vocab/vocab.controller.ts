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
  Param,
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

  @UseGuards(JwtAuthGuard)
  @Delete('folder/:folderId')
  async deleteFolder(@Param() param) {
    return this.vocabService.deleteFolder(param.folderId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('vocabulary')
  async createVocabulary(@Body() body) {
    return this.vocabService.createVocabulary(
      body.folderId,
      body.vocabularyName,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('vocabulary/:vocabularyId')
  async deleteVocabulary(@Param() param) {
    return this.vocabService.deleteVocabulary(param.vocabularyId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('words')
  async createWords(@Body() body) {
    return this.vocabService.createWords(body.vocabularyId, body.words);
  }

  @UseGuards(JwtAuthGuard)
  @Get('words/:vocabularyId')
  async getWords(@Param() param) {
    return await this.vocabService.getWords(param.vocabularyId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('speech/:word')
  async getSpeech(@Param() param, @Res() res: Response) {
    return await this.vocabService.getSpeech(param.word, res);
  }
}
