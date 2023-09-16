import { Injectable } from '@nestjs/common';
import { WordsRepository } from './words.repository';
import { CreateWordsDto } from './words.dto';

@Injectable()
export class WordsService {
  constructor(private readonly wordsRepository: WordsRepository) {}

  async create(createWordsDto: CreateWordsDto) {
    return this.wordsRepository.create(createWordsDto);
  }
}
