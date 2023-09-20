import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false })
export class User {
  @Prop({ required: true, type: Number })
  kakaoId: number;

  @Prop({ required: true, type: String })
  provider: string;

  @Prop({ default: '', type: String })
  name: string;

  @Prop({ default: '', type: String })
  email: string;

  @Prop({ default: '', type: String })
  bio: string;

  @Prop({ default: '', type: String })
  company: string;

  @Prop({
    default: 'https://img.leemhoon00.com/default-image.png',
    type: String,
  })
  image: string;

  @Prop({ default: false, type: Boolean, required: true, index: true })
  like: boolean;

  @Prop({ default: null, type: String || null })
  currentRefreshToken: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
