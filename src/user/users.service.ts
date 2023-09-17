import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { UsersRepository } from './user.repository';
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
  ) {}

  async getUserInfo(_id: Types.ObjectId): Promise<UserInfoDto> {
    return await this.usersRepository.getUserInfo(_id);
  }

  async updateUserInfo(
    userId: Types.ObjectId,
    updateUserInfoDto: UpdateUserInfoDto,
  ) {
    await this.usersRepository.updateUserInfo(userId, updateUserInfoDto);
    return;
  }

  async deleteUser(userId: Types.ObjectId, res: Response) {
    const user = await this.usersRepository.getUserInfo(userId);
    if (user.image !== this.configService.get('DEFAULT_IMAGE')) {
      await this.deleteS3Image(userId);
    }
    await this.foldersService.deleteAllFolders(userId);
    await this.usersRepository.deleteUser(userId);
    res.clearCookie('jwt');
    res.clearCookie('isLoggedIn');
    return res.send();
  }

  async uploadProfileImage(
    userId: Types.ObjectId,
    file: Express.Multer.File,
  ): Promise<void> {
    const user = await this.usersRepository.getUserInfo(userId);
    if (user.image !== this.configService.get('DEFAULT_IMAGE')) {
      await this.deleteS3Image(userId);
    }
    // S3 upload
    const s3Command = new PutObjectCommand({
      Bucket: this.configService.get('BUCKET_NAME'),
      Key: String('images/' + userId + extname(file.originalname)),
      Body: file.buffer,
      ContentType: file.mimetype,
    });
    await this.s3Client.send(s3Command);
    const filename = String(userId + extname(file.originalname));
    const imageUrl = `${this.configService.get('CLOUDFRONT_URL')}/${filename}`;
    await this.usersRepository.updateProfileImage(userId, imageUrl);

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

  async deleteProfileImage(userId: Types.ObjectId): Promise<void> {
    await this.deleteS3Image(userId);
    await this.usersRepository.updateProfileImage(
      userId,
      this.configService.get('DEFAULT_IMAGE'),
    );
    return;
  }

  async deleteS3Image(userId: Types.ObjectId) {
    const user = await this.usersRepository.getUserInfo(userId);
    const command = new DeleteObjectCommand({
      Bucket: this.configService.get('BUCKET_NAME'),
      Key: String('images/' + userId + extname(user.image)),
    });
    await this.s3Client.send(command);
    return;
  }
}
