import { IsString, IsAlpha, IsMongoId, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WordDto {
  @ApiProperty()
  @IsMongoId()
  _id: string;

  @ApiProperty()
  @IsAlpha()
  word: string;

  @ApiProperty()
  @IsString()
  meaning: string;
}

export class VocabularyDto {
  @ApiProperty()
  @IsMongoId()
  _id: string;

  @ApiProperty()
  @IsString()
  title: string;
}

export class CreateFolderDto {
  @ApiProperty({ description: '폴더 이름' })
  @IsString()
  readonly folderName: string;
}

export class GetFoldersDto {
  @ApiProperty()
  @IsMongoId()
  id: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ type: [VocabularyDto] })
  @IsArray()
  vocabularies: [VocabularyDto];
}

export class GetFolderDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  @IsArray()
  vocabularies: [
    {
      _id: string;
      title: string;
    },
  ];
}

export class CreateVocabularyDto {
  @ApiProperty()
  @IsMongoId()
  folderId: string;

  @ApiProperty()
  @IsString()
  vocabularyName: string;
}

export class CreateWordsDto {
  @ApiProperty()
  @IsMongoId()
  vocabularyId: string;

  @ApiProperty()
  @IsArray()
  words: [{ word: string; meaning: string }];
}

export class GetWordsDto {
  @ApiProperty({ description: '단어장 id', required: true })
  @IsMongoId()
  _id: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ type: [WordDto] })
  @IsArray()
  words: [WordDto];
}
