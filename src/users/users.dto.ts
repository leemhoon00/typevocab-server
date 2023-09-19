import { IsNotEmpty, IsEmail, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty()
  @IsNumber()
  readonly kakaoId: number;

  @IsNotEmpty()
  @IsEmail()
  readonly provider: string;
}

export class UserInfoDto {
  @ApiProperty({ description: '유저 이름', example: '김코딩' })
  name: string;

  @ApiProperty({ description: '유저 이메일', example: 'example.kakao.com' })
  email: string;

  @ApiProperty({ description: '유저 소개', example: '안녕하세요' })
  bio: string;

  @ApiProperty({ description: '유저 회사', example: '카카오' })
  company: string;

  @ApiProperty({ description: '유저 이미지', example: 'https://example.com' })
  image: string;
}

export class UpdateUserInfoDto {
  @ApiProperty({ description: '유저 이름', example: '김코딩' })
  name: string;

  @ApiProperty({ description: '유저 이메일', example: 'example.kakao.com' })
  email: string;

  @ApiProperty({ description: '유저 소개', example: '안녕하세요' })
  bio: string;

  @ApiProperty({ description: '유저 회사', example: '카카오' })
  company: string;
}
