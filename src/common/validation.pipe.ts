// import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
// import { HttpException, HttpStatus } from '@nestjs/common';
// import { v4 as uuid } from 'uuid';

// @Injectable()
// export class UUIDPipe implements PipeTransform {
//   types = ['param', 'query'];
//   datas = ['folderId', 'vocabularyId', 'wordId'];
//   transform(value: any, metadata: ArgumentMetadata) {
//     if (
//       !this.types.includes(metadata.type) ||
//       !this.datas.includes(metadata.data)
//     ) {
//       return value;
//     }

//     if (uuid.validate(value) === false) {
//       throw new HttpException('invalid folderId', HttpStatus.BAD_REQUEST);
//     }
//     return value;
//   }
// }
