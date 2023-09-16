import {
  Controller,
  UseGuards,
  Req,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FoldersService } from './folders.service';
import { CreateFolderDto } from './folders.dto';
import { Request } from 'express';

import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('folders')
@Controller('folders')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @ApiOperation({ summary: '폴더 생성' })
  @ApiParam({ name: 'folderName', description: '폴더 이름', type: 'string' })
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(201)
  async create(@Req() req: Request, @Param() createFolderDto: CreateFolderDto) {
    createFolderDto.userId = req.user._id;
    return await this.foldersService.create(createFolderDto);
  }
}
