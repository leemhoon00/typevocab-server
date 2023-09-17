import { Injectable } from '@nestjs/common';
import { FoldersRepository } from './folders.repository';
import { CreateFolderDto, FolderAndVocabulariesDto } from './folders.dto';
import { Types } from 'mongoose';

import { VocabulariesRepository } from '../vocabularies/vocabularies.repository';
import { WordsRepository } from '../words/words.repository';

@Injectable()
export class FoldersService {
  constructor(
    private readonly foldersRepository: FoldersRepository,
    private readonly vocabulariesRepository: VocabulariesRepository,
    private readonly wordsRepository: WordsRepository,
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

  async delete(folderId: Types.ObjectId): Promise<void> {
    const vocabularies =
      await this.vocabulariesRepository.findAllbyFolderId(folderId);
    await Promise.all(
      vocabularies.map(async (vocabulary) => {
        await this.wordsRepository.deleteAllByVocabularyId(vocabulary._id);
      }),
    );
    await this.vocabulariesRepository.deleteAllByFolderId(folderId);
    await this.foldersRepository.delete(folderId);
    return;
  }

  async deleteAllFolders(userId: Types.ObjectId) {
    const folders = await this.foldersRepository.findAllByUserId(userId);
    await Promise.all(
      folders.map(async (folder) => {
        await this.delete(folder._id);
      }),
    );
    return;
  }
}
