import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersRepository } from 'src/users/users.repository';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

describe('auth.service', () => {
  let authService: AuthService;
  let usersRepository: UsersRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        ConfigService,
        JwtService,
        {
          provide: UsersRepository,
          useValue: {
            getUser: jest.fn(),
            create: jest.fn(),
            setCurrentRefreshToken: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('kakaoValidateUser', () => {
    it('사용자가 존재하지 않으면 새로 생성한다', async () => {
      jest.spyOn(usersRepository, 'getUser').mockResolvedValue(undefined);
      jest.spyOn(usersRepository, 'create').mockResolvedValue({} as any);
      await authService.kakaoValidateUser('1234');
      expect(usersRepository.create).toBeCalledWith('1234');
    });
  });
});
