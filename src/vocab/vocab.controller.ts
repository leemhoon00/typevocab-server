import {
  Controller,
  Get,
  Post,
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
import {
  CreateFolderDto,
  GetFoldersDto,
  CreateVocabularyDto,
  CreateWordsDto,
  GetWordsDto,
} from './dto/vocab.dto';
import {
  ApiTags,
  ApiCookieAuth,
  ApiOperation,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

@ApiTags('vocab')
@ApiCookieAuth('jwt')
@ApiUnauthorizedResponse({ description: 'unAuthorization' })
@ApiNotFoundResponse({ description: '404 Not Found' })
@Controller('vocab')
export class VocabController {
  constructor(private readonly vocabService: VocabService) {}

  @ApiOperation({ summary: '새 폴더 생성' })
  @ApiBody({ type: CreateFolderDto, description: '폴더 이름' })
  @ApiOkResponse({ description: 'ok', type: [GetFoldersDto] })
  @UseGuards(JwtAuthGuard)
  @Post('folder')
  async createFolder(@Req() req: Request, @Body() body) {
    return this.vocabService.createFolder(req.user._id, body);
  }

  @ApiOperation({ summary: '모든 폴더 조회' })
  @ApiOkResponse({ description: 'ok', type: [GetFoldersDto] })
  @UseGuards(JwtAuthGuard)
  @Get('folder')
  async getFolders(@Req() req: Request): Promise<GetFoldersDto[]> {
    return this.vocabService.getFolders(req.user._id);
  }

  @ApiOperation({ summary: '폴더 삭제' })
  @ApiOkResponse({ description: 'ok' })
  @UseGuards(JwtAuthGuard)
  @Delete('folder/:folderId')
  async deleteFolder(@Param() param): Promise<void> {
    return this.vocabService.deleteFolder(param.folderId);
  }

  @ApiOperation({ summary: '단어장 생성' })
  @ApiBody({ type: CreateVocabularyDto })
  @ApiOkResponse({ description: 'ok', type: [GetFoldersDto] })
  @UseGuards(JwtAuthGuard)
  @Post('vocabulary')
  async createVocabulary(@Body() body): Promise<GetFoldersDto[]> {
    return this.vocabService.createVocabulary(
      body.folderId,
      body.vocabularyName,
    );
  }

  @ApiOperation({ summary: '단어장 삭제' })
  @ApiOkResponse({ description: 'ok' })
  @UseGuards(JwtAuthGuard)
  @Delete('vocabulary/:vocabularyId')
  async deleteVocabulary(@Param() param): Promise<void> {
    return this.vocabService.deleteVocabulary(param.vocabularyId);
  }

  @ApiOperation({ summary: '단어 생성' })
  @ApiBody({ type: CreateWordsDto })
  @ApiOkResponse({ description: 'ok' })
  @UseGuards(JwtAuthGuard)
  @Post('words')
  async createWords(@Body() body): Promise<void> {
    return this.vocabService.createWords(body);
  }

  @ApiOperation({ summary: '단어 조회' })
  @ApiOkResponse({ description: 'ok', type: GetWordsDto })
  @UseGuards(JwtAuthGuard)
  @Get('words/:vocabularyId')
  async getWords(@Param() param): Promise<GetWordsDto> {
    return await this.vocabService.getWords(param.vocabularyId);
  }

  @ApiOperation({ summary: 'TTS, AudioStream 반환' })
  @ApiOkResponse({ description: 'ok' })
  @UseGuards(JwtAuthGuard)
  @Get('speech/:word')
  async getSpeech(@Param() param, @Res() res: Response) {
    return await this.vocabService.getSpeech(param.word, res);
  }
}
