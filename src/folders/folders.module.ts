import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FoldersController } from './folders.controller';
import { FoldersService } from './folders.service';
import { FoldersRepository } from './folders.repository';
import { Folder, FolderSchema } from './folder.schema';

import { VocabulariesRepository } from '../vocabularies/vocabularies.repository';
import {
  Vocabulary,
  VocabularySchema,
} from '../vocabularies/vocabulary.schema';
import { WordsRepository } from '../words/words.repository';
import { Word, WordSchema } from '../words/word.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Folder.name, schema: FolderSchema },
      { name: Vocabulary.name, schema: VocabularySchema },
      { name: Word.name, schema: WordSchema },
    ]),
  ],
  controllers: [FoldersController],
  providers: [
    FoldersService,
    FoldersRepository,
    VocabulariesRepository,
    WordsRepository,
  ],
  exports: [FoldersService, FoldersRepository],
})
export class FoldersModule {}
