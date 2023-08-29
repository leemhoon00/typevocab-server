import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  id: string;

  @Prop()
  provider: string;

  @Prop({ default: '' })
  name: string;

  @Prop({ default: '' })
  email: string;

  @Prop({ default: '' })
  bio: string;

  @Prop({ default: '' })
  company: string;

  @Prop({ default: 'https://img.leemhoon00.com/default-image.png' })
  image: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
