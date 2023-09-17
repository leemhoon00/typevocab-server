import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Word } from './word.schema';
import { CreateWordsDto, WordDto } from './words.dto';
import { Types } from 'mongoose';

@Injectable()
export class WordsRepository {
  constructor(@InjectModel(Word.name) private wordModel: Model<Word>) {}

  async create(createWordsDto: CreateWordsDto): Promise<void> {
    const { vocabularyId, words } = createWordsDto;
    const toCreateWords = words.map((word) => {
      return {
        vocabularyId,
        ...word,
      };
    });
    await this.wordModel.deleteMany({ vocabularyId });
    await this.wordModel.insertMany(toCreateWords);
    return;
  }

  async findAllByVocabularyId(
    vocabularyId: Types.ObjectId,
  ): Promise<WordDto[]> {
    return await this.wordModel
      .find({ vocabularyId }, { vocabularyId: false })
      .exec();
  }

  async deleteAllByVocabularyId(vocabularyId: Types.ObjectId): Promise<void> {
    await this.wordModel.deleteMany({ vocabularyId });
    return;
  }
}
