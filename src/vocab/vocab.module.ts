import { Module } from '@nestjs/common';
import { VocabController } from './vocab.controller';
import { VocabService } from './vocab.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [VocabController],
  providers: [VocabService],
  exports: [VocabService],
})
export class VocabModule {}
