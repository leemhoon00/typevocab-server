import { Injectable } from '@nestjs/common';
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
// import {
//   CloudFrontClient,
//   CreateInvalidationCommand,
// } from '@aws-sdk/client-cloudfront';

@Injectable()
export class UserService {
  s3Client: any;
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {
    this.s3Client = new S3Client({});
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
    const command = new PutObjectCommand({
      Bucket: this.configService.get('BUCKET_NAME'),
      Key: String('images/' + userId + extname(file.originalname)),
      Body: file.buffer,
    });
    try {
      await this.s3Client.send(command);
      const filename = String(userId + extname(file.originalname));
      const imageUrl = `${this.configService.get(
        'CLOUDFRONT_URL',
      )}/${filename}`;
      await this.userModel.updateOne(
        { id: userId },
        { $set: { image: imageUrl } },
      );

      // const client = new CloudFrontClient({
      //   region: 'ap-northeast-2',
      //   credentials: {
      //     accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
      //     secretAccessKey: this.configService.get('AWS_SECRET_KEY'),
      //   },
      // });
      // const params2 = {
      //   DistributionId: 'E2NOA1SL2ZI7OD',
      //   InvalidationBatch: {
      //     CallerReference: String(new Date().getTime()),
      //     Paths: {
      //       Quantity: 1,
      //       Items: [filename],
      //     },
      //   },
      // };
      // const createInvalidationCommand = new CreateInvalidationCommand(params2);
      // const response2 = await client.send(createInvalidationCommand);
      // console.log('Posted cloudfront invalidation, response is:');
      // console.log(response2);

      return { success: true, image: imageUrl };
    } catch (err) {
      console.log(err);
      return { success: false };
    }
  }

  async deleteProfileImage(userId: string) {
    try {
      const user = await this.userModel.findOne({ id: userId });
      const command = new DeleteObjectCommand({
        Bucket: this.configService.get('BUCKET_NAME'),
        Key: String('images/' + userId + extname(user.image)),
      });
      await this.s3Client.send(command);
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
