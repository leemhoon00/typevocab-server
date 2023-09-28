import {
  Controller,
  HttpCode,
  UseGuards,
  Body,
  Param,
  Post,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { VocabulariesService } from './vocabularies.service';
import { CreateVocabularyDto, CreateProblemsDto } from './vocabularies.dto';
import { WordDto } from 'src/words/words.dto';
import {
  ApiTags,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiBody,
  ApiCookieAuth,
  ApiResponse,
  ApiParam,
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
  @ApiResponse({ status: 201, description: 'Created' })
  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  async createVocabulary(
    @Body() createVocabularyDto: CreateVocabularyDto,
  ): Promise<void> {
    return await this.vocabulariesService.create(createVocabularyDto);
  }

  @ApiOperation({ summary: '문제 생성' })
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiBody({ type: CreateProblemsDto })
  @Post('/problems')
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  async createProblems(
    @Body() createProblemsDto: CreateProblemsDto,
  ): Promise<WordDto[]> {
    return await this.vocabulariesService.createProblems(createProblemsDto);
  }

  @ApiOperation({ summary: '단어장 삭제' })
  @ApiResponse({ status: 204, description: 'No Content' })
  @ApiParam({
    name: 'vocabularyId',
    type: Number,
    example: 11,
  })
  @Delete(':vocabularyId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async deleteVocabulary(
    @Param('vocabularyId', ParseIntPipe) vocabularyId: number,
  ): Promise<void> {
    return await this.vocabulariesService.delete(vocabularyId);
  }
}
