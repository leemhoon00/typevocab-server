import { Module } from '@nestjs/common';
import { VocabulariesController } from './vocabularies.controller';
import { VocabulariesService } from './vocabularies.service';
import { VocabulariesRepository } from './vocabularies.repository';

@Module({
  controllers: [VocabulariesController],
  providers: [VocabulariesService, VocabulariesRepository],
  exports: [VocabulariesService, VocabulariesRepository],
})
export class VocabulariesModule {}
