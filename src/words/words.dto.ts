import { IsMongoId, IsArray, IsAlpha, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class WordDto {
  @ApiProperty({
    type: Types.ObjectId,
    description: 'Word ID',
    example: '5f9d2a3b9d9d9f9d9d9f9d9d',
  })
  @IsMongoId()
  _id: Types.ObjectId;

  @ApiProperty()
  @IsAlpha()
  word: string;

  @ApiProperty()
  @IsString()
  meaning: string;
}

export class CreateWordDto {
  @ApiProperty({ description: 'Word', example: 'apple', type: String })
  @IsAlpha()
  word: string;

  @ApiProperty({ description: 'Meaning', example: '사과', type: String })
  @IsString()
  meaning: string;
}

export class CreateWordsDto {
  @ApiProperty({
    type: Types.ObjectId,
    description: 'Vocabulary ID',
    example: '5f9d2a3b9d9d9f9d9d9f9d9d',
  })
  @IsMongoId()
  vocabularyId: Types.ObjectId;

  @ApiProperty({ type: [CreateWordDto], description: 'Array of words' })
  @IsArray()
  words: CreateWordDto[];
}
