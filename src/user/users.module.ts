import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { S3Client } from '@aws-sdk/client-s3';
import { CloudFrontClient } from '@aws-sdk/client-cloudfront';

import { FoldersService } from '../folders/folders.service';
import { FoldersRepository } from '../folders/folders.repository';
import { VocabulariesRepository } from 'src/vocabularies/vocabularies.repository';
import { WordsRepository } from 'src/words/words.repository';

import { Folder, FolderSchema } from '../folders/folder.schema';
import {
  Vocabulary,
  VocabularySchema,
} from '../vocabularies/vocabulary.schema';
import { Word, WordSchema } from '../words/word.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Folder.name, schema: FolderSchema },
      { name: Vocabulary.name, schema: VocabularySchema },
      { name: Word.name, schema: WordSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    S3Client,
    CloudFrontClient,
    FoldersService,
    FoldersRepository,
    VocabulariesRepository,
    WordsRepository,
  ],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
