import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FoldersController } from './folders.controller';
import { FoldersService } from './folders.service';
import { FoldersRepository } from './folders.repository';
import { Folder, FolderSchema } from './folder.schema';
import {
  Vocabulary,
  VocabularySchema,
} from '../vocabularies/vocabulary.schema';
import { VocabulariesRepository } from '../vocabularies/vocabularies.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Folder.name, schema: FolderSchema },
      { name: Vocabulary.name, schema: VocabularySchema },
    ]),
  ],
  controllers: [FoldersController],
  providers: [FoldersService, FoldersRepository, VocabulariesRepository],
})
export class FoldersModule {}
