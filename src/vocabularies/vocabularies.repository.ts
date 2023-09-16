import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Vocabulary, VocabularyDocument } from './vocabulary.schema';
import { CreateVocabularyDto } from './vocabularies.dto';

@Injectable()
export class VocabulariesRepository {
  constructor(
    @InjectModel(Vocabulary.name)
    private vocabularyModel: Model<VocabularyDocument>,
  ) {}

  async create(createVocabularyDto: CreateVocabularyDto): Promise<void> {
    const createdVocabulary = new this.vocabularyModel(createVocabularyDto);
    await createdVocabulary.save();
    return;
  }

  async findAllbyFolderId(
    folderId: Types.ObjectId,
  ): Promise<VocabularyDocument[]> {
    return this.vocabularyModel.find({ folderId }).exec();
  }

  async delete(vocabularyId: Types.ObjectId): Promise<void> {
    await this.vocabularyModel.deleteOne({ _id: vocabularyId }).exec();
    return;
  }
}
