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
  Query,
  ValidationPipe,
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
  WordDto,
} from './dto/vocab.dto';
import {
  FolderIdParam,
  VocabularyIdParam,
  WordParam,
  CreateProblemParam,
} from './dto/param.dto';
import {
  ApiTags,
  ApiCookieAuth,
  ApiOperation,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

@ApiTags('vocab')
@ApiCookieAuth('jwt')
@ApiUnauthorizedResponse({ description: 'unauthorized - jwt 토큰 인증 실패' })
@ApiBadRequestResponse({ description: 'badRequest - api 요청 형식 안맞음' })
@Controller('vocab')
export class VocabController {
  constructor(private readonly vocabService: VocabService) {}

  @ApiOperation({ summary: '새 폴더 생성' })
  @ApiBody({ type: CreateFolderDto, description: '폴더 이름' })
  @ApiOkResponse({ description: 'ok', type: [GetFoldersDto] })
  @UseGuards(JwtAuthGuard)
  @Post('folder')
  async createFolder(
    @Req() req: Request,
    @Body() createFolderDto: CreateFolderDto,
  ) {
    return this.vocabService.createFolder(req.user._id, createFolderDto);
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
  async deleteFolder(@Param() folderIdParam: FolderIdParam): Promise<void> {
    return this.vocabService.deleteFolder(folderIdParam.folderId);
  }

  @ApiOperation({ summary: '단어장 생성' })
  @ApiBody({ type: CreateVocabularyDto })
  @ApiOkResponse({ description: 'ok', type: [GetFoldersDto] })
  @UseGuards(JwtAuthGuard)
  @Post('vocabulary')
  async createVocabulary(
    @Body() createVocabularyDto: CreateVocabularyDto,
  ): Promise<GetFoldersDto[]> {
    return this.vocabService.createVocabulary(createVocabularyDto);
  }

  @ApiOperation({ summary: '단어장 삭제' })
  @ApiOkResponse({ description: 'ok' })
  @UseGuards(JwtAuthGuard)
  @Delete('vocabulary/:vocabularyId')
  async deleteVocabulary(
    @Param() vocabularyIdParam: VocabularyIdParam,
  ): Promise<void> {
    return this.vocabService.deleteVocabulary(vocabularyIdParam.vocabularyId);
  }

  @ApiOperation({ summary: '단어 생성' })
  @ApiBody({ type: CreateWordsDto })
  @ApiOkResponse({ description: 'ok' })
  @UseGuards(JwtAuthGuard)
  @Post('words')
  async createWords(@Body() createWordsDto: CreateWordsDto): Promise<void> {
    return this.vocabService.createWords(createWordsDto);
  }

  @ApiOperation({ summary: '단어 조회' })
  @ApiOkResponse({ description: 'ok', type: GetWordsDto })
  @UseGuards(JwtAuthGuard)
  @Get('words/:vocabularyId')
  async getWords(
    @Param() vocabularyIdParam: VocabularyIdParam,
  ): Promise<GetWordsDto> {
    return await this.vocabService.getWords(vocabularyIdParam.vocabularyId);
  }

  @ApiOperation({ summary: 'TTS, AudioStream 반환' })
  @ApiOkResponse({ description: 'ok' })
  @UseGuards(JwtAuthGuard)
  @Get('speech/:word')
  async getSpeech(@Param() wordParam: WordParam, @Res() res: Response) {
    return await this.vocabService.getSpeech(wordParam.word, res);
  }

  @ApiOperation({ summary: '문제 생성' })
  @ApiOkResponse({ description: 'ok', type: [WordDto] })
  @UseGuards(JwtAuthGuard)
  @Get('problem')
  async getProblem(
    @Query(new ValidationPipe({ transform: true })) query: CreateProblemParam,
  ) {
    return this.vocabService.createProblem(query);
  }
}
