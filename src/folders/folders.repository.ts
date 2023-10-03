import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Folder } from '@prisma/client';
import { CreateFolderDto, FolderAndVocabulariesDto } from './folders.dto';

@Injectable()
export class FoldersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFolderDto: CreateFolderDto): Promise<Folder> {
    return await this.prisma.folder.create({ data: createFolderDto });
  }

  async findAllByUserId(userId: string): Promise<Folder[]> {
    return await this.prisma.folder.findMany({
      where: { userId },
    });
  }

  async delete(folderId: number): Promise<void> {
    await this.prisma.folder.delete({ where: { folderId } });
    return;
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    await this.prisma.folder.deleteMany({ where: { userId } });
    return;
  }

  async findAllFoldersAndVocabulariesByUserId(
    userId: string,
  ): Promise<FolderAndVocabulariesDto[]> {
    return await this.prisma.folder.findMany({
      where: { userId },
      select: {
        folderId: true,
        folderName: true,
        vocabularies: true,
      },
    });
  }
}
