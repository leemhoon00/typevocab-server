import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, SchemaTypes } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { Vocabulary } from './vocabulary.schema';

export type WordBookDocument = HydratedDocument<WordBook>;

@Schema()
export class WordBook {
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: User.name })
  user: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ default: [] })
  vocabularies: [Vocabulary];
}

export const WordBookSchema = SchemaFactory.createForClass(WordBook);
