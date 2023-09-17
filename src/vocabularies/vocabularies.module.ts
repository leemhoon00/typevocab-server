import { Module } from '@nestjs/common';
import { VocabulariesController } from './vocabularies.controller';
import { VocabulariesService } from './vocabularies.service';
import { VocabulariesRepository } from './vocabularies.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Vocabulary, VocabularySchema } from './vocabulary.schema';

import { WordsRepository } from 'src/words/words.repository';
import { Word, WordSchema } from 'src/words/word.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Vocabulary.name, schema: VocabularySchema },
      { name: Word.name, schema: WordSchema },
    ]),
  ],
  controllers: [VocabulariesController],
  providers: [VocabulariesService, VocabulariesRepository, WordsRepository],
  exports: [VocabulariesService, VocabulariesRepository],
})
export class VocabulariesModule {}
