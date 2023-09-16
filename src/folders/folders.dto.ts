import { IsString, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFolderBodyDto {
  @ApiProperty({ example: '폴더 이름' })
  @IsString()
  folderName: string;
}

export class CreateFolderDto extends CreateFolderBodyDto {
  @IsMongoId()
  userId?: string;
}
