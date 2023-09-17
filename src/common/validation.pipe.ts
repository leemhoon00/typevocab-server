import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { Types } from 'mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class MongoIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'param' || metadata.data !== 'folderId') {
      return value;
    }

    if (!Types.ObjectId.isValid(value)) {
      throw new HttpException('invalid folderId', HttpStatus.BAD_REQUEST);
    }
    return value;
  }
}
