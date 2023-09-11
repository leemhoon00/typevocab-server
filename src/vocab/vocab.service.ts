import { Injectable, HttpException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Folder, FolderDocument } from './schemas/folder.schema';
import { Vocabulary, VocabularyDocument } from './schemas/vocabulary.schema';
import { Word, WordDocument } from './schemas/word.schema';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VocabService {
  constructor(
    @InjectModel(Folder.name) private folderModel: Model<Folder>,
    @InjectModel(Vocabulary.name) private vocabularyModel: Model<Vocabulary>,
    @InjectModel(Word.name) private wordModel: Model<Word>,
  ) {}
  async createFolder(_id: string, folderName: string) {
    await this.folderModel.create({
      user: new Types.ObjectId(_id),
      title: folderName,
    });
    return this.getFolders(_id);
  }

  async getFolders(_id: string) {
    return this.folderModel
      .find({ user: new Types.ObjectId(_id) }, { user: false, __v: false })
      .populate('vocabularies', { __v: false, words: false });
  }

  async getFolder(folderId: string) {
    return await this.folderModel
      .findById(folderId, { user: false, __v: false })
      .populate('vocabularies', { __v: false, words: false });
  }

  async deleteFolder(folderId: string) {
    // Delete all vocabularies in the folder
    const toDeleteVocab = await this.getFolder(folderId);
    for (const vocab of toDeleteVocab.vocabularies) {
      await this.deleteVocabulary(vocab._id.toString());
    }

    const result = await this.folderModel.deleteOne({
      _id: new Types.ObjectId(folderId),
    });
    if (result.deletedCount !== 0) {
      return;
    } else {
      throw new HttpException('Not Found', 404);
    }
  }

  async createVocabulary(folderId: string, vocabularyName: string) {
    const folder = await this.folderModel.findById(folderId);
    const vocabulary = await this.vocabularyModel.create({
      title: vocabularyName,
    });
    folder.vocabularies.push(new Types.ObjectId(vocabulary._id));
    await folder.save();

    return this.getFolders(folder.user.toString());
  }

  async createWords(vocabularyId: string, words) {
    const vocabulary = await this.vocabularyModel.findById(vocabularyId);
    const wordIds: Types.ObjectId[] = [];
    for (const word of words) {
      const wordObj = await this.wordModel.create({
        word: word.word,
        meaning: word.meaning,
      });
      wordIds.push(new Types.ObjectId(wordObj._id));
    }
    vocabulary.words = wordIds;
    await vocabulary.save();
    return;
  }

  async getWords(vocabularyId: string) {
    return await this.vocabularyModel
      .findById(vocabularyId)
      .populate('words', { __v: false });
  }

  async deleteVocabulary(vocabularyId: string) {
    // Delete all words in the vocabulary
    const toDeleteWords = await this.getWords(vocabularyId);
    this.wordModel.deleteMany({
      _id: { $in: toDeleteWords.words.map((word) => word._id) },
    });
    const result = await this.vocabularyModel.deleteOne({
      _id: new Types.ObjectId(vocabularyId),
    });
    if (result.deletedCount !== 0) {
      return;
    } else {
      throw new HttpException('Not Found', 404);
    }
  }
}
