import { IsString, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

import { VocabularyDto } from '../vocabularies/vocabularies.dto';

export class CreateFolderBodyDto {
  @ApiProperty({ example: '해커스 노랭이', type: String })
  @IsString()
  folderName: string;
}

export class CreateFolderDto extends CreateFolderBodyDto {
  @IsMongoId()
  userId?: Types.ObjectId;
}

export class FolderAndVocabulariesDto {
  @ApiProperty({
    description: '폴더 아이디',
    example: '60f0a9b0e0b9f3a9e8b0a0a0',
    type: Types.ObjectId,
  })
  @IsMongoId()
  _id: Types.ObjectId;

  @ApiProperty({
    example: '해커스 노랭이',
    type: String,
  })
  @IsString()
  folderName: string;

  @ApiProperty({ description: '단어장 목록', type: [VocabularyDto] })
  vocabularies: VocabularyDto[];
}
