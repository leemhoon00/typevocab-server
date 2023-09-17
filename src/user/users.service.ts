import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UsersRepository } from './user.repository';
import { User } from './user.schema';
import { UserInfoDto, UpdateUserInfoDto } from './users.dto';
import { Response } from 'express';
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
import { FoldersService } from 'src/folders/folders.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersRepository: UsersRepository,
    private readonly s3Client: S3Client,
    private readonly cfClient: CloudFrontClient,
    private readonly foldersService: FoldersService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async getUserInfo(_id: Types.ObjectId): Promise<UserInfoDto> {
    return await this.usersRepository.getUser(_id);
  }

  async updateUserInfo(
    userId: Types.ObjectId,
    updateUserInfoDto: UpdateUserInfoDto,
  ) {
    await this.usersRepository.updateUserInfo(userId, updateUserInfoDto);
    return;
  }

  async deleteUser(userId: Types.ObjectId, res: Response) {
    const user = await this.userModel.findOne({ _id: userId });
    if (user.image !== this.configService.get('DEFAULT_IMAGE')) {
      await this.deleteS3Image(userId);
    }
    await this.foldersService.deleteAllFolders(userId);
    await this.usersRepository.deleteUser(userId);
    res.clearCookie('jwt');
    res.clearCookie('isLoggedIn');
    return res.send();
  }

  async uploadProfileImage(_id: Types.ObjectId, file: Express.Multer.File) {
    const user = await this.getUserInfo(_id);
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
    const imageUrl = `${this.configService.get('CLOUDFRONT_URL')}/${filename}`;
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
  }

  async deleteProfileImage(userId: Types.ObjectId) {
    await this.deleteS3Image(userId);
    await this.usersRepository.updateProfileImage(
      userId,
      this.configService.get('DEFAULT_IMAGE'),
    );
    return;
  }

  async deleteS3Image(userId: Types.ObjectId) {
    const user = await this.usersRepository.getUser(userId);
    const command = new DeleteObjectCommand({
      Bucket: this.configService.get('BUCKET_NAME'),
      Key: String('images/' + userId + extname(user.image)),
    });
    await this.s3Client.send(command);
    return;
  }
}
