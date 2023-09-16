import { Controller, HttpCode, UseGuards, Body, Post } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { VocabulariesService } from './vocabularies.service';
import { CreateVocabularyDto } from './vocabularies.dto';
import {
  ApiTags,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiBody,
  ApiCookieAuth,
} from '@nestjs/swagger';

@ApiTags('vocabularies')
@ApiCookieAuth('jwt')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiBadRequestResponse({ description: 'Bad Request' })
@Controller('vocabularies')
export class VocabulariesController {
  constructor(private vocabulariesService: VocabulariesService) {}

  @ApiOperation({ summary: '단어장 생성' })
  @ApiBody({ type: CreateVocabularyDto })
  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  async createVocabulary(@Body() createVocabularyDto: CreateVocabularyDto) {
    return await this.vocabulariesService.create(createVocabularyDto);
  }
}
