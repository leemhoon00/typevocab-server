import { Injectable } from '@nestjs/common';
import { VocabulariesRepository } from './vocabularies.repository';
import { CreateVocabularyDto, CreateProblemsDto } from './vocabularies.dto';

import { WordDto } from 'src/words/words.dto';

@Injectable()
export class VocabulariesService {
  constructor(private vocabulariesRepository: VocabulariesRepository) {}

  async create(createVocabularyDto: CreateVocabularyDto): Promise<void> {
    return await this.vocabulariesRepository.create(createVocabularyDto);
  }

  async createProblems(
    createProblemsDto: CreateProblemsDto,
  ): Promise<WordDto[]> {
    const result = await this.vocabulariesRepository.createProblems(
      createProblemsDto.vocabularyIds,
    );
    if (createProblemsDto.isRandom) {
      result.sort(() => Math.random() - 0.5);
    }
    return result;
  }

  async delete(vocabularyId: number) {
    await this.vocabulariesRepository.delete(vocabularyId);
    return;
  }
}
