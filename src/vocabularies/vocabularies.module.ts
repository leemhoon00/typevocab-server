import { Module } from '@nestjs/common';
import { VocabulariesController } from './vocabularies.controller';
import { VocabulariesService } from './vocabularies.service';

@Module({
  controllers: [VocabulariesController],
  providers: [VocabulariesService]
})
export class VocabulariesModule {}
