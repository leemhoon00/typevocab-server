import { Injectable, HttpException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Folder, FolderDocument } from './schemas/folder.schema';
import { Vocabulary, VocabularyDocument } from './schemas/vocabulary.schema';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VocabService {
  constructor(
    @InjectModel(Folder.name) private folderModel: Model<Folder>,
    @InjectModel(Vocabulary.name) private vocabularyModel: Model<Vocabulary>,
  ) {}
  async createFolder(_id: string, folderName: string) {
    return await this.folderModel.create({
      user: new Types.ObjectId(_id),
      title: folderName,
    });
  }

  async getFolders(_id: string) {
    return this.folderModel.find(
      { user: new Types.ObjectId(_id) },
      { user: false, __v: false },
    );
  }

  async deleteFolder(folderId: string) {
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
    folder.vocabularies.push(vocabulary._id);
    return await folder.save();
  }
}
