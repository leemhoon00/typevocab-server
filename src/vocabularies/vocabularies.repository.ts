import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Vocabulary, Word } from '@prisma/client';
import { CreateVocabularyDto } from './vocabularies.dto';

@Injectable()
export class VocabulariesRepository {
  constructor(private prisma: PrismaService) {}

  async create(createVocabularyDto: CreateVocabularyDto): Promise<void> {
    await this.prisma.vocabulary.create({ data: createVocabularyDto });
    return;
  }

  async findAllbyFolderId(folderId: string): Promise<Vocabulary[]> {
    return await this.prisma.vocabulary.findMany({
      where: { folderId },
    });
  }

  async delete(vocabularyId: string): Promise<void> {
    await this.prisma.vocabulary.delete({ where: { vocabularyId } });
    return;
  }

  async deleteAllByFolderId(folderId: string): Promise<void> {
    await this.prisma.vocabulary.deleteMany({ where: { folderId } });
    return;
  }

  async createProblems(vocabularyIds: string[]): Promise<Word[]> {
    return await this.prisma.word.findMany({
      where: { vocabularyId: { in: vocabularyIds } },
    });
  }
}
