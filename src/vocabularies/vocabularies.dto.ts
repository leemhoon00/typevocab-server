import { IsMongoId, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class VocabularyDto {
  @ApiProperty({ example: '6505922e12c0a18b08041796' })
  @IsMongoId()
  _id: Types.ObjectId;

  @ApiProperty({ example: '6505922e12c0a18b08041796' })
  @IsMongoId()
  folderId: Types.ObjectId;

  @ApiProperty({ example: '단어장 이름' })
  @IsString()
  vocabularyName: string;
}

export class CreateVocabularyDto {
  @ApiProperty()
  @IsMongoId()
  folderId: string;

  @ApiProperty()
  @IsString()
  vocabularyName: string;
}
