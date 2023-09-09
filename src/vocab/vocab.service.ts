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
    console.log(folderId);
    const result = await this.folderModel.deleteOne({
      _id: new Types.ObjectId(folderId),
    });
    if (result.deletedCount !== 0) {
      return;
    } else {
      throw new HttpException('Not Found', 404);
    }
  }
}
