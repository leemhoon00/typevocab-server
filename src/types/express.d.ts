import { Request as Req } from 'express';

declare module 'express' {
  interface Request extends Req {
    user: {
      userId?: number;
    };
  }
}
