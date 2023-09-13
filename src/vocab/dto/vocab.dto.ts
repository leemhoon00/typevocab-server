import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WordDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  word: string;

  @ApiProperty()
  meaning: string;
}

export class CreateFolderDto {
  @ApiProperty({ description: '폴더 이름' })
  @IsNotEmpty()
  @IsString()
  readonly folderName: string;
}

export class GetFoldersDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  vocabularies: [{ _id: string; title: string }];
}

export class GetFolderDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  vocabularies: [
    {
      _id: string;
      title: string;
    },
  ];
}

export class CreateVocabularyDto {
  @ApiProperty()
  folderId: string;

  @ApiProperty()
  vocabularyName: string;
}

export class CreateWordsDto {
  @ApiProperty()
  vocabularyId: string;

  @ApiProperty()
  words: [{ word: string; meaning: string }];
}

export class GetWordsDto {
  @ApiProperty({ description: '단어장 id', required: true })
  _id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ type: [WordDto] })
  words: [WordDto];
}
