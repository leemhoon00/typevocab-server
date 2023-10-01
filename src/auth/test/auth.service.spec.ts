import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersRepository } from 'src/users/users.repository';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/users/users.dto';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let usersRepository: UsersRepository;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        ConfigService,
        {
          provide: UsersRepository,
          useValue: {
            getUser: jest.fn(),
            create: jest.fn(),
            setCurrentRefreshToken: jest.fn(),
            getUserWithCurrentRefreshToken: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getJWT', () => {
    const userId = '1234';
    it('메소드 3개 호출', async () => {
      jest.spyOn(authService, 'kakaoValidateUser').mockResolvedValue({
        userId,
      } as UserDto);

      jest
        .spyOn(authService, 'generateAccessToken')
        .mockReturnValue('accessToken');
      jest
        .spyOn(authService, 'generateRefreshToken')
        .mockResolvedValue('refreshToken');

      await authService.getJWT(userId);
      expect(authService.kakaoValidateUser).toBeCalledWith(userId);
      expect(authService.generateAccessToken).toBeCalledWith({ userId });
      expect(authService.generateRefreshToken).toBeCalledWith({ userId });
    });
  });

  describe('kakaoValidateUser', () => {
    const userId = '1234';
    it('유저가 없는 경우', async () => {
      jest.spyOn(usersRepository, 'getUser').mockResolvedValue(null);
      jest
        .spyOn(usersRepository, 'create')
        .mockResolvedValue({ userId } as any);
      const result = await authService.kakaoValidateUser(userId);
      expect(usersRepository.getUser).toBeCalledWith(userId);
      expect(usersRepository.create).toBeCalledWith(userId);
      expect(result).toEqual({ userId });
    });

    it('유저가 있는 경우', async () => {
      jest
        .spyOn(usersRepository, 'getUser')
        .mockResolvedValue({ userId } as any);

      const result = await authService.kakaoValidateUser(userId);
      expect(usersRepository.getUser).toBeCalledWith(userId);
      expect(usersRepository.create).not.toBeCalled();
      expect(result).toEqual({ userId });
    });
  });

  describe('generateAccessToken', () => {
    const userId = '1234';
    it('jwtService.sign() 호출', () => {
      authService.generateAccessToken({ userId } as UserDto);
      expect(jwtService.sign).toBeCalledWith({ userId });
    });
  });

  describe('generateRefreshToken', () => {
    const userId = '1234';
    it('jwtService.sign(), bcrypt.hash(), usersRepository.setCurrentRefreshToken() 호출', async () => {
      jest.spyOn(jwtService, 'sign').mockReturnValue('refreshToken');
      await authService.generateRefreshToken({ userId } as UserDto);
      expect(jwtService.sign).toBeCalledWith(
        { userId },
        {
          secret: configService.get('JWT_REFRESH_SECRET'),
          expiresIn: configService.get('JWT_REFRESH_EXPIRES_IN'),
        },
      );
      expect(usersRepository.setCurrentRefreshToken).toBeCalledWith(
        userId,
        expect.any(String),
      );
    });
  });

  describe('refresh', () => {
    it('refreshToken이 유효한 경우', async () => {
      const refreshTokenMock = 'refreshToken';
      const userMock = {
        userId: '1234',
        currentRefreshToken: 'refreshToken',
      };
      jest.spyOn(jwtService, 'verify').mockReturnValue({ userId: '1234' });
      jest
        .spyOn(usersRepository, 'getUserWithCurrentRefreshToken')
        .mockResolvedValue(userMock as any);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);
      jest
        .spyOn(authService, 'generateAccessToken')
        .mockReturnValue('accessToken');

      await authService.refresh(refreshTokenMock);

      expect(jwtService.verify).toBeCalledWith(refreshTokenMock, {
        secret: configService.get('JWT_REFRESH_SECRET'),
      });
      expect(usersRepository.getUserWithCurrentRefreshToken).toBeCalledWith(
        '1234',
      );
      expect(bcrypt.compareSync).toBeCalledWith(
        refreshTokenMock,
        'refreshToken',
      );
      expect(authService.generateAccessToken).toBeCalledWith(userMock);
    });
  });
});
