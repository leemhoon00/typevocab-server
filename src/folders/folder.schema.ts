import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, SchemaTypes } from 'mongoose';
import { User } from 'src/users/user.schema';

export type FolderDocument = HydratedDocument<Folder>;

@Schema({ versionKey: false })
export class Folder {
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: User.name })
  userId: Types.ObjectId;

  @Prop({ required: true })
  folderName: string;
}

export const FolderSchema = SchemaFactory.createForClass(Folder);
