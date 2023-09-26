import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWordsDto, WordDto } from './words.dto';

@Injectable()
export class WordsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createWordsDto: CreateWordsDto): Promise<void> {
    const { vocabularyId, words } = createWordsDto;
    const toCreateWords = words.map((word) => {
      return {
        vocabularyId,
        ...word,
      };
    });
    await this.prisma.word.deleteMany({ where: { vocabularyId } });
    await this.prisma.word.createMany({
      data: toCreateWords,
    });
    return;
  }

  async findAllByVocabularyId(vocabularyId: string): Promise<WordDto[]> {
    return await this.prisma.word.findMany({
      where: { vocabularyId },
      select: { wordId: true, word: true, meaning: true },
    });
  }
}
