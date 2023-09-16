import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, SchemaTypes } from 'mongoose';
import { Folder } from 'src/folders/folder.schema';

export type VocabularyDocument = HydratedDocument<Vocabulary>;

@Schema()
export class Vocabulary {
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: Folder.name })
  folderId: Types.ObjectId;

  @Prop({ required: true })
  vocabularyName: string;
}

export const VocabularySchema = SchemaFactory.createForClass(Vocabulary);
