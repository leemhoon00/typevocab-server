import { Injectable, HttpException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Folder } from './schemas/folder.schema';
import { Vocabulary } from './schemas/vocabulary.schema';
import { Word } from './schemas/word.schema';
import { Response } from 'express';
import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';
import {
  CreateFolderDto,
  GetFoldersDto,
  GetFolderDto,
  CreateWordsDto,
  GetWordsDto,
  CreateVocabularyDto,
  WordDto,
} from './dto/vocab.dto';
import { CreateProblemParam } from './dto/param.dto';

@Injectable()
export class VocabService {
  pollyClient: any;
  constructor(
    @InjectModel(Folder.name) private folderModel: Model<Folder>,
    @InjectModel(Vocabulary.name) private vocabularyModel: Model<Vocabulary>,
    @InjectModel(Word.name) private wordModel: Model<Word>,
  ) {
    this.pollyClient = new PollyClient({});
  }
  async createFolder(
    _id: string,
    createFolderDto: CreateFolderDto,
  ): Promise<GetFoldersDto[]> {
    await this.folderModel.create({
      user: new Types.ObjectId(_id),
      title: createFolderDto.folderName,
    });
    return await this.getFolders(_id);
  }

  async getFolders(_id: string): Promise<GetFoldersDto[]> {
    return await this.folderModel
      .find({ user: new Types.ObjectId(_id) }, { user: false, __v: false })
      .populate('vocabularies', { __v: false, words: false });
  }

  async getFolder(folderId: string): Promise<GetFolderDto> {
    return await this.folderModel
      .findById(folderId, { user: false, __v: false })
      .populate('vocabularies', { __v: false, words: false });
  }

  async deleteFolder(folderId: string): Promise<void> {
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

  async createVocabulary(
    createVocabularyDto: CreateVocabularyDto,
  ): Promise<GetFoldersDto[]> {
    const folder = await this.folderModel.findById(
      createVocabularyDto.folderId,
    );
    const vocabulary = await this.vocabularyModel.create({
      title: createVocabularyDto.vocabularyName,
    });
    folder.vocabularies.push(new Types.ObjectId(vocabulary._id));
    await folder.save();

    return this.getFolders(folder.user.toString());
  }

  async createWords(createWordDto: CreateWordsDto): Promise<void> {
    const vocabulary = await this.vocabularyModel.findById(
      createWordDto.vocabularyId,
    );
    const wordIds: Types.ObjectId[] = [];
    for (const word of createWordDto.words) {
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

  async getWords(vocabularyId: string): Promise<GetWordsDto> {
    return await this.vocabularyModel
      .findById(vocabularyId)
      .populate('words', { __v: false });
  }

  async deleteVocabulary(vocabularyId: string): Promise<void> {
    // Delete all words in the vocabulary
    const toDeleteWords = await this.getWords(vocabularyId);
    await this.wordModel.deleteMany({
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

  async getSpeech(word: string, res: Response) {
    const command = new SynthesizeSpeechCommand({
      Engine: 'standard',
      LanguageCode: 'en-US',
      OutputFormat: 'mp3',
      Text: word,
      TextType: 'text',
      VoiceId: 'Joanna',
    });
    const response = await this.pollyClient.send(command);
    res.setHeader('Content-Type', 'application/octet-stream');
    response.AudioStream.pipe(res);
  }

  async createProblem(
    createProblemParam: CreateProblemParam,
  ): Promise<WordDto[]> {
    const result = await this.vocabularyModel
      .find(
        {
          _id: { $in: createProblemParam.vocabularies },
        },
        { __v: false },
      )
      .populate('words', { __v: false });
    const words: any = result.map((vocabulary) => vocabulary.words).flat();
    if (createProblemParam.randomOption) {
      words.sort(() => Math.random() - 0.5);
    }
    return words;
  }
}
