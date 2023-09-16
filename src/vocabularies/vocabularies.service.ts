import { Injectable } from '@nestjs/common';
import { VocabulariesRepository } from './vocabularies.repository';
import { CreateVocabularyDto } from './vocabularies.dto';
import { Types } from 'mongoose';

import { WordsRepository } from 'src/words/words.repository';

@Injectable()
export class VocabulariesService {
  constructor(
    private vocabulariesRepository: VocabulariesRepository,
    private wordsRepository: WordsRepository,
  ) {}

  async create(createVocabularyDto: CreateVocabularyDto) {
    return await this.vocabulariesRepository.create(createVocabularyDto);
  }

  async delete(vocabularyId: Types.ObjectId) {
    await this.wordsRepository.deleteAllByVocabularyId(vocabularyId);
    await this.vocabulariesRepository.delete(vocabularyId);
    return;
  }
}
