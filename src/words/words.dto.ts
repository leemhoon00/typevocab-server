import { IsMongoId, IsArray, IsAlpha, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class WordDto {
  @ApiProperty({
    type: Types.ObjectId,
    example: '5f9d2a3b9d9d9f9d9d9f9d9d',
  })
  @IsMongoId()
  _id: Types.ObjectId;

  @ApiProperty({ example: 'apple', type: String })
  @IsAlpha()
  word: string;

  @ApiProperty({ example: '사과', type: String })
  @IsString()
  meaning: string;
}

export class CreateWordDto {
  @ApiProperty({ example: 'apple', type: String })
  @IsAlpha()
  word: string;

  @ApiProperty({ example: '사과', type: String })
  @IsString()
  meaning: string;
}

export class CreateWordsDto {
  @ApiProperty({
    type: Types.ObjectId,
    example: '5f9d2a3b9d9d9f9d9d9f9d9d',
  })
  @IsMongoId()
  vocabularyId: Types.ObjectId;

  @ApiProperty({ type: [CreateWordDto], description: 'Array of words' })
  @IsArray()
  words: CreateWordDto[];
}
