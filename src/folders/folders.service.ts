import { Injectable } from '@nestjs/common';
import { FoldersRepository } from './folders.repository';
import { CreateFolderDto } from './folders.dto';

@Injectable()
export class FoldersService {
  constructor(private readonly foldersRepository: FoldersRepository) {}

  async create(createFolderDto: CreateFolderDto) {
    return await this.foldersRepository.create(createFolderDto);
  }
}
