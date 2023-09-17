import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { Types } from 'mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class MongoIdPipe implements PipeTransform {
  types = ['param', 'query'];
  datas = ['folderId', 'vocabularyId', 'wordId'];
  transform(value: any, metadata: ArgumentMetadata) {
    if (
      !this.types.includes(metadata.type) ||
      !this.datas.includes(metadata.data)
    ) {
      return value;
    }

    if (!Types.ObjectId.isValid(value)) {
      throw new HttpException('invalid folderId', HttpStatus.BAD_REQUEST);
    }
    return value;
  }
}
