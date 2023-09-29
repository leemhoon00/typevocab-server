import { IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { VocabularyDto } from '../vocabularies/vocabularies.dto';

export class CreateFolderBodyDto {
  @ApiProperty({ example: '해커스 노랭이', type: String })
  @IsString()
  folderName: string;
}

export class CreateFolderDto extends CreateFolderBodyDto {
  @IsString()
  userId: string;
}

export class FolderAndVocabulariesDto {
  @ApiProperty({ example: 11, type: Number })
  @IsInt()
  folderId: number;

  @ApiProperty({ example: '해커스 노랭이', type: String })
  @IsString()
  folderName: string;

  @ApiProperty({ description: '단어장 목록', type: [VocabularyDto] })
  vocabularies: VocabularyDto[];
}
