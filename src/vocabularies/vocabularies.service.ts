import { Injectable } from '@nestjs/common';
import { VocabulariesRepository } from './vocabularies.repository';
import { CreateVocabularyDto } from './vocabularies.dto';

@Injectable()
export class VocabulariesService {
  constructor(private vocabulariesRepository: VocabulariesRepository) {}

  async create(createVocabularyDto: CreateVocabularyDto) {
    return await this.vocabulariesRepository.create(createVocabularyDto);
  }
}
