import { IsArray, IsAlpha, IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WordDto {
  @ApiProperty({
    type: Number,
    example: 11,
  })
  @IsInt()
  wordId: number;

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
    type: Number,
    example: 11,
  })
  @IsInt()
  vocabularyId: number;

  @ApiProperty({ type: [CreateWordDto], description: 'Array of words' })
  @IsArray()
  words: CreateWordDto[];
}
