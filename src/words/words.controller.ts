import {
  Controller,
  UseGuards,
  HttpCode,
  Body,
  Get,
  Post,
  Query,
  Param,
  Res,
} from '@nestjs/common';
import { WordsService } from './words.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateWordsDto, WordDto } from './words.dto';
import { Types } from 'mongoose';
import { Response } from 'express';
import {
  ApiTags,
  ApiCookieAuth,
  ApiOperation,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

@ApiTags('words')
@ApiCookieAuth('jwt')
@ApiUnauthorizedResponse({ description: 'unauthorized - jwt 토큰 인증 실패' })
@ApiBadRequestResponse({ description: 'badRequest - api 요청 형식 안맞음' })
@Controller('words')
export class WordsController {
  constructor(private readonly wordsService: WordsService) {}

  @ApiOperation({ summary: '단어 생성' })
  @ApiBody({ type: CreateWordsDto, description: '단어' })
  @ApiResponse({ status: 201, description: 'created' })
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(201)
  async create(@Body() createWordsDto: CreateWordsDto): Promise<void> {
    return await this.wordsService.create(createWordsDto);
  }

  @ApiOperation({ summary: '단어 조회' })
  @ApiResponse({ status: 200, description: 'ok', type: [WordDto] })
  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(200)
  async findAllByVocabularyId(
    @Query('vocabularyId') vocabularyId: Types.ObjectId,
  ): Promise<WordDto[]> {
    return await this.wordsService.findAllByVocabularyId(vocabularyId);
  }

  @ApiOperation({ summary: '단어 발음' })
  @ApiResponse({ status: 200, description: 'ok' })
  @UseGuards(JwtAuthGuard)
  @Get(':word')
  @HttpCode(200)
  async speech(
    @Param('word') word: string,
    @Res() res: Response,
  ): Promise<void> {
    return await this.wordsService.speech(word, res);
  }
}
