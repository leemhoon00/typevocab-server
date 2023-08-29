import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/user.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findUser(userId: string): Promise<User> {
    return this.userModel.findOne({ id: userId });
  }

  async getUser(userId: string): Promise<User> {
    return this.userModel.findOne(
      { id: userId },
      { _id: false, __v: false, id: false, provider: false },
    );
  }

  async updateUser(req: any) {
    const result = await this.userModel.updateOne(
      { id: req.user.userId },
      { $set: { ...req.body } },
    );
    if (result.modifiedCount === 0) {
      return { success: false };
    } else {
      return { success: true };
    }
  }

  async deleteUser(userId: string, res: Response) {
    const result = await this.userModel.deleteOne({ id: userId });
    if (result.deletedCount === 0) {
      return { success: false };
    } else {
      res.clearCookie('jwt');
      res.clearCookie('isLoggedIn');
      res.json({ success: true });
    }
  }
}
