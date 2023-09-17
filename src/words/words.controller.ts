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
import { MongoIdPipe } from 'src/common/validation.pipe';
import {
  ApiTags,
  ApiCookieAuth,
  ApiOperation,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiResponse,
  ApiBadRequestResponse,
  ApiQuery,
  ApiParam,
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
  @ApiQuery({
    name: 'vocabularyId',
    description: '단어장 아이디',
    type: String,
    example: '5f9e1c1b9d3b9a2b1c3b4d5e',
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(200)
  async findAllByVocabularyId(
    @Query('vocabularyId', MongoIdPipe) vocabularyId: Types.ObjectId,
  ): Promise<WordDto[]> {
    return await this.wordsService.findAllByVocabularyId(vocabularyId);
  }

  @ApiOperation({ summary: '단어 발음' })
  @ApiParam({ name: 'word', type: String, example: 'apple' })
  @ApiResponse({ status: 200, description: 'ok', type: ReadableStream })
  @UseGuards(JwtAuthGuard)
  @Get(':word')
  @HttpCode(200)
  async speech(@Param('word') word: string, @Res() res: Response) {
    return await this.wordsService.speech(word, res);
  }
}
