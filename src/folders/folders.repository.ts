import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Folder } from './folder.schema';
import { CreateFolderDto } from './folders.dto';

@Injectable()
export class FoldersRepository {
  constructor(@InjectModel(Folder.name) private folderModel: Model<Folder>) {}

  async create(createFolderDto: CreateFolderDto): Promise<Folder> {
    return await this.folderModel.create({
      userId: createFolderDto.userId,
      folderName: createFolderDto.folderName,
    });
  }
}
