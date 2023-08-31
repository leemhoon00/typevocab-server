import { Request as Req } from 'express';

declare module 'express' {
  interface Request extends Req {
    user: {
      id?: string;
      userId: string;
    };
    // 추가적인 사용자 관련 정보를 필요한 만큼 확장할 수 있습니다.
  }
}
