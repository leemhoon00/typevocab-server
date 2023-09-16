import { Module } from '@nestjs/common';
import { VocabularyController } from './vocabulary.controller';
import { VocabularyService } from './vocabulary.service';

@Module({
  controllers: [VocabularyController],
  providers: [VocabularyService]
})
export class VocabularyModule {}
