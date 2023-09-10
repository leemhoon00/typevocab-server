import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, SchemaTypes } from 'mongoose';
import { Word } from './word.schema';

export type VocabularyDocument = HydratedDocument<Vocabulary>;

@Schema()
export class Vocabulary {
  @Prop({ required: true })
  title: string;

  @Prop({ default: [], type: [{ type: SchemaTypes.ObjectId, ref: Word.name }] })
  words: Types.ObjectId[] | null[];
}

export const VocabularySchema = SchemaFactory.createForClass(Vocabulary);
