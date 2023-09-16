import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, SchemaTypes } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

export type FolderDocument = HydratedDocument<Folder>;

@Schema()
export class Folder {
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: User.name })
  userId: Types.ObjectId;

  @Prop({ required: true })
  folderName: string;
}

export const FolderSchema = SchemaFactory.createForClass(Folder);
