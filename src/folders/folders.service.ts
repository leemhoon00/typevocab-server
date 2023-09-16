import { Injectable } from '@nestjs/common';
import { FoldersRepository } from './folders.repository';
import { CreateFolderDto, FolderAndVocabulariesDto } from './folders.dto';
import { Types } from 'mongoose';

import { VocabulariesRepository } from '../vocabularies/vocabularies.repository';

@Injectable()
export class FoldersService {
  constructor(
    private readonly foldersRepository: FoldersRepository,
    private readonly vocabulariesRepository: VocabulariesRepository,
  ) {}

  async create(
    createFolderDto: CreateFolderDto,
  ): Promise<FolderAndVocabulariesDto[]> {
    await this.foldersRepository.create(createFolderDto);
    return await this.findAllFoldersAndVocabulariesByUserId(
      createFolderDto.userId,
    );
  }

  async findAllFoldersAndVocabulariesByUserId(
    userId: Types.ObjectId,
  ): Promise<FolderAndVocabulariesDto[]> {
    const folders = await this.foldersRepository.findAllByUserId(userId);
    const data = await Promise.all(
      folders.map(async (folder) => {
        const vocabularies =
          await this.vocabulariesRepository.findAllbyFolderId(folder._id);
        return { _id: folder._id, folderName: folder.folderName, vocabularies };
      }),
    );
    return data;
  }
}
