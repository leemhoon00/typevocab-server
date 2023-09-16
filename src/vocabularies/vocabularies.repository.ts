import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vocabulary, VocabularyDocument } from './vocabulary.schema';
import { CreateVocabularyDto } from './vocabularies.dto';

@Injectable()
export class VocabulariesRepository {
  constructor(
    @InjectModel(Vocabulary.name)
    private vocabularyModel: Model<VocabularyDocument>,
  ) {}

  async create(createVocabularyDto: CreateVocabularyDto) {
    const createdVocabulary = new this.vocabularyModel(createVocabularyDto);
    return createdVocabulary.save();
  }
}
