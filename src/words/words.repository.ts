import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Word } from './words.schema';
import { CreateWordsDto } from './words.dto';

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
    await this.wordModel.insertMany(toCreateWords);
    return;
  }
}
