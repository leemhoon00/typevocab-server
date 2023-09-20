import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { UsersRepository } from './users.repository';
import { UserDto, UpdateUserInfoDto } from './users.dto';
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

  async getUserInfo(_id: Types.ObjectId): Promise<UserDto> {
    return await this.usersRepository.getUser(_id);
  }

  async updateUserInfo(
    userId: Types.ObjectId,
    updateUserInfoDto: UpdateUserInfoDto,
  ) {
    await this.usersRepository.updateUserInfo(userId, updateUserInfoDto);
    return;
  }

  async deleteUser(userId: Types.ObjectId) {
    const user = await this.usersRepository.getUser(userId);
    if (user.image !== this.configService.get('DEFAULT_IMAGE')) {
      await this.deleteS3Image(userId);
    }
    await this.foldersService.deleteAllFolders(userId);
    await this.usersRepository.deleteUser(userId);
    return;
  }

  async uploadProfileImage(
    userId: Types.ObjectId,
    file: Express.Multer.File,
  ): Promise<void> {
    const user = await this.usersRepository.getUser(userId);
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
    const user = await this.usersRepository.getUser(userId);
    const command = new DeleteObjectCommand({
      Bucket: this.configService.get('BUCKET_NAME'),
      Key: String('images/' + userId + extname(user.image)),
    });
    await this.s3Client.send(command);
    return;
  }

  async getLikesCount(): Promise<number> {
    return await this.usersRepository.getLikesCount();
  }

  async like(userId: Types.ObjectId): Promise<void> {
    return await this.usersRepository.like(userId);
  }

  async unlike(userId: Types.ObjectId): Promise<void> {
    return await this.usersRepository.unlike(userId);
  }
}
