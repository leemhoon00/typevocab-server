import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, SchemaTypes } from 'mongoose';

export type WordDocument = HydratedDocument<Word>;

@Schema()
export class Word {
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'Vocabulary' })
  vocabularyId: Types.ObjectId;

  @Prop({ required: true })
  word: string;

  @Prop({ required: true })
  meaning: string;
}

export const WordSchema = SchemaFactory.createForClass(Word);
