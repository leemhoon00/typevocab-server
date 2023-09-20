import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class Payload {
  @IsMongoId()
  userId: Types.ObjectId;
}
