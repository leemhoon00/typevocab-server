import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, SchemaTypes } from 'mongoose';

export type VocabularyDocument = HydratedDocument<Vocabulary>;

@Schema()
export class Vocabulary {
  @Prop({ required: true })
  title: string;
}

export const VocabularySchema = SchemaFactory.createForClass(Vocabulary);
