import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, SchemaTypes, model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { Vocabulary } from './vocabulary.schema';

export type FolderDocument = HydratedDocument<Folder>;

@Schema()
export class Folder {
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: User.name })
  user: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({
    default: [],
    type: [{ type: SchemaTypes.ObjectId, ref: () => Vocabulary }],
  })
  vocabularies: Types.ObjectId[];
}

export const FolderSchema = SchemaFactory.createForClass(Folder);
