import { Injectable, HttpException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto, GetUserDto } from './dto/user.dto';
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

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findUserByKakaoId(id: string): Promise<UserDocument> {
    return this.userModel.findOne({ id });
  }

  async findUser(_id: string): Promise<UserDocument> {
    return this.userModel.findOne({ _id });
  }

  async getUser(_id: string): Promise<GetUserDto> {
    return this.userModel.findOne(
      { _id },
      { _id: false, __v: false, id: false, provider: false },
    );
  }

  async updateUser(req: Request) {
    const result = await this.userModel.updateOne(
      { _id: req.user._id },
      { $set: { ...req.body } },
    );
    if (result.modifiedCount !== 0) {
      return;
    } else {
      throw new HttpException('Not Found', 404);
    }
  }

  async deleteUser(_id: string, res: Response) {
    const user = await this.userModel.findOne({ _id });
    if (user.image !== this.configService.get('DEFAULT_IMAGE')) {
      await this.deleteS3Image(_id);
    }
    const result = await this.userModel.deleteOne({ _id: _id });
    if (result.deletedCount === 0) {
      throw new HttpException('Not Found', 404);
    } else {
      res.clearCookie('jwt');
      res.clearCookie('isLoggedIn');
      return res.send();
    }
  }

  async uploadProfileImage(_id: string, file: Express.Multer.File) {
    try {
      const user = await this.getUser(_id);
      if (user.image !== this.configService.get('DEFAULT_IMAGE')) {
        await this.deleteS3Image(_id);
      }
      // S3 upload
      const s3Command = new PutObjectCommand({
        Bucket: this.configService.get('BUCKET_NAME'),
        Key: String('images/' + _id + extname(file.originalname)),
        Body: file.buffer,
        ContentType: file.mimetype,
      });
      await this.s3Client.send(s3Command);
      const filename = String(_id + extname(file.originalname));
      const imageUrl = `${this.configService.get(
        'CLOUDFRONT_URL',
      )}/${filename}`;
      await this.userModel.updateOne({ _id }, { $set: { image: imageUrl } });

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
      return;
    } catch (err) {
      console.log(err);
      throw new HttpException('Not Found', 404);
    }
  }

  async deleteProfileImage(_id: string) {
    try {
      this.deleteS3Image(_id);
      await this.userModel.updateOne({
        _id,
        image: `${this.configService.get('DEFAULT_IMAGE')}`,
      });
      return;
    } catch (err) {
      console.log(err);
      throw new HttpException('Not Found', 404);
    }
  }

  async deleteS3Image(_id: string) {
    try {
      const user = await this.userModel.findOne({ _id });
      const command = new DeleteObjectCommand({
        Bucket: this.configService.get('BUCKET_NAME'),
        Key: String('images/' + _id + extname(user.image)),
      });
      await this.s3Client.send(command);
    } catch (err) {
      console.log(err);
      throw new HttpException('Not Found', 404);
    }
  }
}
