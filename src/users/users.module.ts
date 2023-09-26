import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { S3Client } from '@aws-sdk/client-s3';
import { CloudFrontClient } from '@aws-sdk/client-cloudfront';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, S3Client, CloudFrontClient],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
