import { IsMongoId, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVocabularyDto {
  @ApiProperty()
  @IsMongoId()
  folderId: string;

  @ApiProperty()
  @IsString()
  vocabularyName: string;
}
