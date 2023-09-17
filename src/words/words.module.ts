import { Module } from '@nestjs/common';
import { WordsController } from './words.controller';
import { WordsService } from './words.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Word, WordSchema } from './word.schema';
import { WordsRepository } from './words.repository';
import { PollyClient } from '@aws-sdk/client-polly';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Word.name, schema: WordSchema }]),
  ],
  controllers: [WordsController],
  providers: [WordsService, WordsRepository, PollyClient],
  exports: [WordsService, WordsRepository],
})
export class WordsModule {}
