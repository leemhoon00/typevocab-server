import {
  Controller,
  UseGuards,
  Req,
  HttpCode,
  Body,
  Post,
  Get,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FoldersService } from './folders.service';
import { CreateFolderBodyDto, FolderAndVocabulariesDto } from './folders.dto';

import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('folders')
@ApiCookieAuth('jwt')
@ApiUnauthorizedResponse({ description: 'unauthorized - jwt 토큰 인증 실패' })
@ApiBadRequestResponse({ description: 'badRequest - api 요청 형식 안맞음' })
@Controller('folders')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @ApiOperation({ summary: '새 폴더 생성' })
  @ApiBody({ description: '폴더 이름', type: CreateFolderBodyDto })
  @ApiResponse({
    status: 201,
    description: '폴더 생성 성공',
    type: FolderAndVocabulariesDto,
    isArray: true,
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(201)
  async create(
    @Req() req: Request,
    @Body() body: CreateFolderBodyDto,
  ): Promise<FolderAndVocabulariesDto[]> {
    return await this.foldersService.create({
      userId: req.user._id,
      folderName: body.folderName,
    });
  }

  @ApiOperation({ summary: '폴더와 단어장 조회' })
  @ApiResponse({
    status: 200,
    description: '폴더와 단어장 조회 성공',
    type: FolderAndVocabulariesDto,
    isArray: true,
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(200)
  async findAllFoldersAndVocabulariesByUserId(
    @Req() req: Request,
  ): Promise<FolderAndVocabulariesDto[]> {
    return await this.foldersService.findAllFoldersAndVocabulariesByUserId(
      req.user._id,
    );
  }
}
