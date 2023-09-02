import { IsNotEmpty, IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly id: string;

  @IsNotEmpty()
  @IsEmail()
  readonly provider: string;

  @IsString()
  readonly email?: string;
}

export class GetUserDto {
  @ApiProperty({ description: '유저 이름' })
  name: string;

  @ApiProperty({ description: '유저 이메일' })
  email: string;

  @ApiProperty({ description: '유저 소개' })
  bio: string;

  @ApiProperty({ description: '유저 회사' })
  company: string;

  @ApiProperty({ description: '유저 이미지' })
  image: string;
}

export class UpdateUserDto {
  @ApiProperty({ description: '유저 이름' })
  name: string;

  @ApiProperty({ description: '유저 이메일' })
  email: string;

  @ApiProperty({ description: '유저 소개' })
  bio: string;

  @ApiProperty({ description: '유저 회사' })
  company: string;
}

export class FileUploadDto {
  @ApiProperty({ description: '유저 프로필 이미지' })
  file: Express.Multer.File;
}
