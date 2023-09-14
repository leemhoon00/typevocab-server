import { IsString, IsMongoId, IsBoolean, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FolderIdParam {
  @IsMongoId()
  folderId: string;
}

export class VocabularyIdParam {
  @IsMongoId()
  vocabularyId: string;
}

export class WordParam {
  @IsString()
  word: string;
}

export class CreateProblemParam {
  @ApiProperty({ description: '랜덤 유무' })
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  randomOption: boolean;

  @ApiProperty({ description: '단어장 아이디' })
  @IsArray()
  vocabularies: string[];
}
