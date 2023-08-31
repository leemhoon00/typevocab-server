import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/user.dto';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { extname } from 'path';

@Injectable()
export class UserService {
  s3: any;
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {
    this.s3 = new AWS.S3({
      accessKeyId: configService.get('AWS_ACCESS_KEY'),
      secretAccessKey: configService.get('AWS_SECRET_KEY'),
    });
  }

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

  async updateUser(req: Request) {
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

  async uploadProfileImage(userId: string, file: Express.Multer.File) {
    const params = {
      Bucket: this.configService.get('BUCKET_NAME'),
      Key: String('images/' + userId + extname(file.originalname)),
      Body: file.buffer,
    };
    try {
      const response = await this.s3.upload(params).promise();
      const filename = response.Key.split('/')[1];
      const imageUrl = `${this.configService.get(
        'CLOUDFRONT_URL',
      )}/${filename}`;
      await this.userModel.updateOne(
        { id: userId },
        { $set: { image: imageUrl } },
      );
      return { success: true, image: imageUrl };
    } catch (err) {
      console.log(err);
      return { success: false };
    }
  }

  async deleteProfileImage(userId: string) {
    try {
      const user = await this.userModel.findOne({ id: userId });
      const params = {
        Bucket: this.configService.get('BUCKET_NAME'),
        Key: String('images/' + userId + extname(user.image)),
      };
      await this.s3.deleteObject(params).promise();
      await this.userModel.updateOne({
        id: userId,
        image: `${this.configService.get('DEFAULT_IMAGE')}`,
      });
      return { success: true };
    } catch (err) {
      console.log(err);
      return { success: false };
    }
  }
}
