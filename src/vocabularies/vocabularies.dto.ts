import { IsMongoId, IsString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class VocabularyDto {
  @ApiProperty({
    example: '6505922e12c0a18b08041796',
    type: Types.ObjectId,
    description: '단어장 아이디',
  })
  @IsMongoId()
  _id: Types.ObjectId;

  @ApiProperty({ example: '6505922e12c0a18b08041796', type: Types.ObjectId })
  @IsMongoId()
  folderId: Types.ObjectId;

  @ApiProperty({ example: 'Day-1', type: String })
  @IsString()
  vocabularyName: string;
}

export class CreateVocabularyDto {
  @ApiProperty({ example: '6505922e12c0a18b08041796', type: Types.ObjectId })
  @IsMongoId()
  folderId: string;

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
    example: ['6505922e12c0a18b08041796'],
    type: [Types.ObjectId],
  })
  @IsMongoId({ each: true })
  vocabularyIds: Types.ObjectId[];
}
