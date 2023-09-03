import { Test } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

const createMockReq = () => {
  const req = {
    cookies: {
      jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjI5ODQxOTA3MTQiLCJpYXQiOjE2OTM3NDcwNjYsImV4cCI6MTY5NDM1MTg2Nn0.o_gWkKkUwqgSL-0On4S-xS0_8DmrpBSiq6wM5Jw-f1U',
    },
    // 다른 req 속성들을 필요에 따라 추가할 수 있습니다.
  };
  return req;
};

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    userController = moduleRef.get<UserController>(UserController);
  });

  describe('get', () => {
    it('should return an array of users', async () => {
      const req: any = createMockReq();
      const result = {
        name: '',
        email: '',
        bio: '',
        company: '',
        image: 'https://img.leemhoon00.com/2984190714.png',
      };
      jest.spyOn(userService, 'getUser').mockImplementation(async () => result);

      expect(await userController.get(req)).toBe(result);
    });
  });
});
