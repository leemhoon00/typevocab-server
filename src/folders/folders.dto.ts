import { IsString, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFolderDto {
  @IsMongoId()
  userId?: string;

  @ApiProperty({ example: '폴더 이름' })
  @IsString()
  folderName: string;
}
