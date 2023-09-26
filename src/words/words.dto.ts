import { IsArray, IsAlpha, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WordDto {
  @ApiProperty({
    type: String,
    example: '5f9d2a3b9d9d9f9d9d9f9d9d',
  })
  @IsUUID()
  wordId: string;

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
    type: String,
    example: '5f9d2a3b9d9d9f9d9d9f9d9d',
  })
  @IsUUID()
  vocabularyId: string;

  @ApiProperty({ type: [CreateWordDto], description: 'Array of words' })
  @IsArray()
  words: CreateWordDto[];
}
