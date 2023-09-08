import { Module } from '@nestjs/common';
import { VocabController } from './vocab.controller';
import { VocabService } from './vocab.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Folder, FolderSchema } from './schemas/folder.schema';
import { Word, WordSchema } from './schemas/word.schema';
import { Vocabulary, VocabularySchema } from './schemas/vocabulary.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Folder.name, schema: FolderSchema },
      { name: Word.name, schema: WordSchema },
      { name: Vocabulary.name, schema: VocabularySchema },
    ]),
  ],
  controllers: [VocabController],
  providers: [VocabService],
  exports: [VocabService],
})
export class VocabModule {}
