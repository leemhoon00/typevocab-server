import { Module } from '@nestjs/common';
import { VocabulariesController } from './vocabularies.controller';
import { VocabulariesService } from './vocabularies.service';
import { VocabulariesRepository } from './vocabularies.repository';

import { WordsRepository } from 'src/words/words.repository';

@Module({
  controllers: [VocabulariesController],
  providers: [VocabulariesService, VocabulariesRepository, WordsRepository],
  exports: [VocabulariesService, VocabulariesRepository],
})
export class VocabulariesModule {}
