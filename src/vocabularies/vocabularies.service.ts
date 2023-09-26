import { Injectable } from '@nestjs/common';
import { VocabulariesRepository } from './vocabularies.repository';
import { CreateVocabularyDto, CreateProblemsDto } from './vocabularies.dto';

import { WordsRepository } from 'src/words/words.repository';
import { WordDto } from 'src/words/words.dto';

@Injectable()
export class VocabulariesService {
  constructor(
    private vocabulariesRepository: VocabulariesRepository,
    private wordsRepository: WordsRepository,
  ) {}

  async create(createVocabularyDto: CreateVocabularyDto): Promise<void> {
    return await this.vocabulariesRepository.create(createVocabularyDto);
  }

  async createProblems(
    createProblemsDto: CreateProblemsDto,
  ): Promise<WordDto[]> {
    const result = await Promise.all(
      createProblemsDto.vocabularyIds.map(async (vocabularyId) => {
        return await this.wordsRepository.findAllByVocabularyId(vocabularyId);
      }),
    ).then((words) => words.flat());
    if (createProblemsDto.isRandom) {
      result.sort(() => Math.random() - 0.5);
    }
    return result;
  }

  async delete(vocabularyId: string) {
    await this.vocabulariesRepository.delete(vocabularyId);
    return;
  }
}
