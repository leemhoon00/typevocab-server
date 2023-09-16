import { Controller, UseGuards, HttpCode, Body, Post } from '@nestjs/common';
import { WordsService } from './words.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateWordsDto } from './words.dto';

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
  async create(@Body() createWordsDto: CreateWordsDto) {
    return await this.wordsService.create(createWordsDto);
  }
}
