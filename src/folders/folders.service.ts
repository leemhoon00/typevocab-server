import { Injectable } from '@nestjs/common';
import { FoldersRepository } from './folders.repository';
import { CreateFolderDto, FolderAndVocabulariesDto } from './folders.dto';

@Injectable()
export class FoldersService {
  constructor(private readonly foldersRepository: FoldersRepository) {}

  async create(
    createFolderDto: CreateFolderDto,
  ): Promise<FolderAndVocabulariesDto[]> {
    await this.foldersRepository.create(createFolderDto);
    return await this.findAllFoldersAndVocabulariesByUserId(
      createFolderDto.userId,
    );
  }

  async findAllFoldersAndVocabulariesByUserId(
    userId: string,
  ): Promise<FolderAndVocabulariesDto[]> {
    return this.foldersRepository.findAllFoldersAndVocabulariesByUserId(userId);
  }

  async delete(folderId: string): Promise<void> {
    await this.foldersRepository.delete(folderId);
    return;
  }

  async deleteAllFolders(userId: string) {
    await this.foldersRepository.deleteAllByUserId(userId);
    return;
  }
}
