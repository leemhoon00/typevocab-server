import { Request as Req } from 'express';
import { Types } from 'mongoose';

declare module 'express' {
  interface Request extends Req {
    user: {
      kakaoId?: number;
      userId?: Types.ObjectId;
    };
  }
}
