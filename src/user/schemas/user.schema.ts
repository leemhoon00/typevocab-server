import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  id: string;

  @Prop()
  provider: string;

  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop()
  bio: string;

  @Prop()
  company: string;

  @Prop()
  image: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
