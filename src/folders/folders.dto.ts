import { IsString, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

import { VocabularyDto } from '../vocabularies/vocabularies.dto';

export class CreateFolderBodyDto {
  @ApiProperty({ example: '해커스 노랭이' })
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

  @ApiProperty({ example: '해커스 노랭이' })
  @IsString()
  folderName: string;

  @ApiProperty({ type: [VocabularyDto] })
  vocabularies: VocabularyDto[];
}

export class TempDto {
  @ApiProperty()
  temp: string;

  @ApiProperty()
  temp2: string;
}

export class TempDto2 extends TempDto {
  @ApiProperty()
  temp3: string;

  @ApiProperty()
  temp4: string;
}
