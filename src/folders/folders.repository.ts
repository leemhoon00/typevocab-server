import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Folder, FolderDocument } from './folder.schema';
import { CreateFolderDto } from './folders.dto';
import { Types } from 'mongoose';

@Injectable()
export class FoldersRepository {
  constructor(
    @InjectModel(Folder.name) private folderModel: Model<FolderDocument>,
  ) {}

  async create(createFolderDto: CreateFolderDto): Promise<FolderDocument> {
    return await this.folderModel.create({
      userId: createFolderDto.userId,
      folderName: createFolderDto.folderName,
    });
  }

  async findAllByUserId(userId: Types.ObjectId): Promise<FolderDocument[]> {
    return await this.folderModel.find({ userId }, { userId: false }).exec();
  }
}
