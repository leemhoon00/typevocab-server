import { Injectable } from '@nestjs/common';
import { WordsRepository } from './words.repository';
import { CreateWordsDto } from './words.dto';
import { Types } from 'mongoose';

@Injectable()
export class WordsService {
  constructor(private readonly wordsRepository: WordsRepository) {}

  async create(createWordsDto: CreateWordsDto): Promise<void> {
    return this.wordsRepository.create(createWordsDto);
  }

  async findAllByVocabularyId(vocabularyId: Types.ObjectId) {
    return await this.wordsRepository.findAllByVocabularyId(vocabularyId);
  }
}
