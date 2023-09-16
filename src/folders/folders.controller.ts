import {
  Controller,
  UseGuards,
  Req,
  HttpCode,
  Body,
  Post,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FoldersService } from './folders.service';
import { CreateFolderBodyDto } from './folders.dto';

import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

@ApiTags('folders')
@ApiUnauthorizedResponse({ description: 'unauthorized - jwt 토큰 인증 실패' })
@ApiBadRequestResponse({ description: 'badRequest - api 요청 형식 안맞음' })
@Controller('folders')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @ApiOperation({ summary: '폴더 생성' })
  @ApiBody({ description: '폴더 이름', type: CreateFolderBodyDto })
  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  async create(@Req() req: Request, @Body() body: CreateFolderBodyDto) {
    return await this.foldersService.create({
      userId: req.user._id,
      folderName: body.folderName,
    });
  }
}
