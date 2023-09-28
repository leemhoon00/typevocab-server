import { IsNumber, IsString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class VocabularyDto {
  @ApiProperty({ example: 11, type: Number })
  @IsNumber()
  vocabularyId: number;

  @ApiProperty({ example: 11, type: Number })
  @IsNumber()
  folderId: number;

  @ApiProperty({ example: 'Day-1', type: String })
  @IsString()
  vocabularyName: string;
}

export class CreateVocabularyDto {
  @ApiProperty({ example: 11, type: Number })
  @IsNumber()
  folderId: number;

  @ApiProperty({ example: 'Day-1', type: String })
  @IsString()
  vocabularyName: string;
}

export class CreateProblemsDto {
  @ApiProperty({ description: '랜덤 유무', example: 'true', type: Boolean })
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isRandom: boolean;

  @ApiProperty({
    example: [11, 12, 13],
    type: [Number],
  })
  @IsNumber({}, { each: true })
  vocabularyIds: number[];
}
