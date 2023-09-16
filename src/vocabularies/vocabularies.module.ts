import { Module } from '@nestjs/common';
import { VocabulariesController } from './vocabularies.controller';
import { VocabulariesService } from './vocabularies.service';
import { VocabulariesRepository } from './vocabularies.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Vocabulary, VocabularySchema } from './vocabulary.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Vocabulary.name, schema: VocabularySchema },
    ]),
  ],
  controllers: [VocabulariesController],
  providers: [VocabulariesService, VocabulariesRepository],
})
export class VocabulariesModule {}
