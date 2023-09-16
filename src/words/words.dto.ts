import { IsMongoId, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWordsDto {
  @ApiProperty()
  @IsMongoId()
  vocabularyId: string;

  @ApiProperty()
  @IsArray()
  words: [{ word: string; meaning: string }];
}
