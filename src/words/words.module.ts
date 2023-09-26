import { Module } from '@nestjs/common';
import { WordsController } from './words.controller';
import { WordsService } from './words.service';
import { WordsRepository } from './words.repository';
import { PollyClient } from '@aws-sdk/client-polly';

@Module({
  controllers: [WordsController],
  providers: [WordsService, WordsRepository, PollyClient],
  exports: [WordsService, WordsRepository],
})
export class WordsModule {}
