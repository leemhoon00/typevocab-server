import { Injectable, HttpException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/user.dto';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import {
  PutObjectCommand,
  DeleteObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { extname } from 'path';
import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from '@aws-sdk/client-cloudfront';

@Injectable()
export class UserService {
  s3Client: any;
  cfClient: any;
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {
    this.s3Client = new S3Client({});
    this.cfClient = new CloudFrontClient({});
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
    if (result.modifiedCount !== 0) {
      return;
    } else {
      throw new HttpException('Forbidden', 403);
    }
  }

  async deleteUser(userId: string, res: Response) {
    const user = await this.userModel.findOne({ id: userId });
    if (user.image !== this.configService.get('DEFAULT_IMAGE')) {
      await this.deleteS3Image(userId);
    }
    const result = await this.userModel.deleteOne({ id: userId });
    if (result.deletedCount === 0) {
      throw new HttpException('Forbidden', 403);
    } else {
      res.clearCookie('jwt');
      res.clearCookie('isLoggedIn');
      return res.send();
    }
  }

  async uploadProfileImage(userId: string, file: Express.Multer.File) {
    try {
      const user = await this.getUser(userId);
      if (user.image !== this.configService.get('DEFAULT_IMAGE')) {
        await this.deleteS3Image(userId);
      }
      // S3 upload
      const s3Command = new PutObjectCommand({
        Bucket: this.configService.get('BUCKET_NAME'),
        Key: String('images/' + userId + extname(file.originalname)),
        Body: file.buffer,
      });
      await this.s3Client.send(s3Command);
      const filename = String(userId + extname(file.originalname));
      const imageUrl = `${this.configService.get(
        'CLOUDFRONT_URL',
      )}/${filename}`;
      await this.userModel.updateOne(
        { id: userId },
        { $set: { image: imageUrl } },
      );

      // CloudFront invalidation
      const cfCommand = new CreateInvalidationCommand({
        DistributionId: this.configService.get('CLOUDFRONT_ID'),
        InvalidationBatch: {
          CallerReference: String(new Date().getTime()),
          Paths: {
            Quantity: 1,
            Items: [String('/' + filename)],
          },
        },
      });
      await this.cfClient.send(cfCommand);
      console.log('temp');
      return { image: imageUrl };
    } catch (err) {
      console.log(err);
      throw new HttpException('Forbidden', 403);
    }
  }

  async deleteProfileImage(userId: string) {
    try {
      this.deleteS3Image(userId);
      await this.userModel.updateOne({
        id: userId,
        image: `${this.configService.get('DEFAULT_IMAGE')}`,
      });
      return;
    } catch (err) {
      console.log(err);
      throw new HttpException('Forbidden', 403);
    }
  }

  async deleteS3Image(userId: string) {
    try {
      const user = await this.userModel.findOne({ id: userId });
      const command = new DeleteObjectCommand({
        Bucket: this.configService.get('BUCKET_NAME'),
        Key: String('images/' + userId + extname(user.image)),
      });
      await this.s3Client.send(command);
    } catch (err) {
      console.log(err);
      throw new HttpException('Forbidden', 403);
    }
  }
}
