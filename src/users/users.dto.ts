import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: '김코딩', type: String })
  name: string;

  @ApiProperty({
    example: 'example.kakao.com',
    type: String,
  })
  email: string;

  @ApiProperty({
    example: '안녕하세요',
    type: String,
  })
  bio: string;

  @ApiProperty({ example: '카카오', type: String })
  company: string;

  @ApiProperty({
    example: 'https://example.com',
    type: String,
  })
  image: string;

  @ApiProperty({ example: true, type: Boolean })
  like: boolean;
}

export class UpdateUserInfoDto {
  @ApiProperty({ example: '김코딩', type: String })
  name: string;

  @ApiProperty({
    example: 'example.kakao.com',
    type: String,
  })
  email: string;

  @ApiProperty({
    example: '안녕하세요',
    type: String,
  })
  bio: string;

  @ApiProperty({ example: '카카오', type: String })
  company: string;
}
