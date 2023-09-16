import { Controller } from '@nestjs/common';
import { VocabulariesService } from './vocabularies.service';
import { CreateVocabularyDto } from './vocabularies.dto';
import {
  ApiTags,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

@ApiTags('vocabularies')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiBadRequestResponse({ description: 'Bad Request' })
@Controller('vocabularies')
export class VocabulariesController {
  constructor(private vocabulariesService: VocabulariesService) {}

  @ApiOperation({ summary: '단어장 생성' })
  async create(createVocabularyDto: CreateVocabularyDto) {
    return await this.vocabulariesService.create(createVocabularyDto);
  }
}
