import { Injectable, HttpException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Folder, FolderDocument } from './schemas/folder.schema';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VocabService {
  constructor(@InjectModel(Folder.name) private folderModel: Model<Folder>) {}
  async createFolder(_id: string, folderName: string) {
    return this.folderModel.create({
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
}
