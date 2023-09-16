import { IsString, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

import { VocabularyDto } from '../vocabularies/vocabularies.dto';

export class CreateFolderBodyDto {
  @ApiProperty({ example: '폴더 이름' })
  @IsString()
  folderName: string;
}

export class CreateFolderDto extends CreateFolderBodyDto {
  @IsMongoId()
  userId?: Types.ObjectId;
}

export class FolderAndVocabulariesDto {
  @ApiProperty({ example: '6505922e12c0a18b08041796' })
  @IsMongoId()
  _id: Types.ObjectId;

  @ApiProperty({ example: '폴더 이름' })
  @IsString()
  folderName: string;

  @ApiProperty({ example: '단어장들' })
  vocabularies: VocabularyDto[];
}
