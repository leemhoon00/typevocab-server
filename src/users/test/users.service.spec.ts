import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { UsersRepository } from '../users.repository';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import { CloudFrontClient } from '@aws-sdk/client-cloudfront';
import { UserDto, UpdateUserInfoDto } from '../users.dto';
import { extname } from 'path';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;
  let configService: ConfigService;
  let s3Client: S3Client;
  let cfClient: CloudFrontClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        ConfigService,
        {
          provide: UsersRepository,
          useValue: {
            getUser: jest.fn(),
            updateUserInfo: jest.fn(),
            deleteUser: jest.fn(),
            updateProfileImage: jest.fn(),
            getLikesCount: jest.fn(),
            like: jest.fn(),
            unlike: jest.fn(),
          },
        },
        {
          provide: S3Client,
          useValue: {
            send: jest.fn(),
          },
        },
        {
          provide: CloudFrontClient,
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    configService = module.get<ConfigService>(ConfigService);
    s3Client = module.get<S3Client>(S3Client);
    cfClient = module.get<CloudFrontClient>(CloudFrontClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserInfo', () => {
    it('usersRepository.getUser() 호출', async () => {
      const userId = '123';
      await usersService.getUserInfo(userId);
      expect(usersRepository.getUser).toBeCalledWith(userId);
    });
  });

  describe('updateUserInfo', () => {
    const userId = '123';
    const updateUserInfoDtoMock: UpdateUserInfoDto = {
      name: '김코딩',
      email: 'example.kakao.com',
      bio: '안녕하세요',
      company: '카카오',
    };

    it('usersRepository.updateUserInfo() 호출', async () => {
      await usersService.updateUserInfo(userId, updateUserInfoDtoMock);
      expect(usersRepository.updateUserInfo).toBeCalledWith(
        userId,
        updateUserInfoDtoMock,
      );
    });
  });

  describe('deleteUser', () => {
    const userId = '123';
    beforeEach(() => {
      jest.spyOn(usersService, 'deleteS3Image').mockResolvedValue();
    });

    it('유저 프로필이 기본 이미지인 경우', async () => {
      jest.spyOn(usersRepository, 'getUser').mockResolvedValue({
        image: 'https://img.leemhoon00.com/default-image.png',
      } as UserDto);
      await usersService.deleteUser(userId);
      expect(usersRepository.getUser).toBeCalledWith(userId);
      expect(usersService.deleteS3Image).not.toBeCalled();
      expect(usersRepository.deleteUser).toBeCalledWith(userId);
    });

    it('유저 프로필이 기본 이미지가 아닌 경우', async () => {
      jest.spyOn(usersRepository, 'getUser').mockResolvedValue({
        image: 'https://img.leemhoon00.com/1234.png',
      } as UserDto);

      await usersService.deleteUser(userId);

      expect(usersRepository.getUser).toBeCalledWith(userId);
      expect(usersService.deleteS3Image).toBeCalledWith(userId);
      expect(usersRepository.deleteUser).toBeCalledWith(userId);
    });
  });

  describe('uploadProfileImage', () => {
    const userId = '1234';
    const file: Express.Multer.File = {
      buffer: Buffer.from(''),
      originalname: 'image.png',
      mimetype: 'image/png',
    } as Express.Multer.File;

    beforeEach(() => {
      jest.spyOn(usersService, 'deleteS3Image').mockResolvedValue();
    });

    it('유저 프로필이 기본 이미지인 경우', async () => {
      const customDate = {
        getTime: jest.fn(() => 1234567890), // Replace with your desired value
      };
      global.Date = jest.fn(() => customDate) as any;
      jest.spyOn(usersRepository, 'getUser').mockResolvedValue({
        image: 'https://img.leemhoon00.com/default-image.png',
      } as UserDto);

      await usersService.uploadProfileImage(userId, file);
      expect(usersService.deleteS3Image).not.toBeCalled();
      expect(s3Client.send).toBeCalledWith(
        expect.objectContaining({
          input: {
            Bucket: configService.get('BUCKET_NAME'),
            Key: 'images/1234.png',
            Body: Buffer.from(''),
            ContentType: 'image/png',
          },
        }),
      );
      expect(usersRepository.updateProfileImage).toBeCalledWith(
        userId,
        `${configService.get('CLOUDFRONT_URL')}/1234.png`,
      );
      expect(cfClient.send).toBeCalledWith(
        expect.objectContaining({
          input: {
            DistributionId: configService.get('CLOUDFRONT_ID'),
            InvalidationBatch: {
              CallerReference: String(new Date().getTime()),
              Paths: {
                Quantity: 1,
                Items: [String('/1234.png')],
              },
            },
          },
        }),
      );
    });

    it('유저 프로필이 기본 이미지가 아닌 경우', async () => {
      jest.spyOn(usersRepository, 'getUser').mockResolvedValue({
        image: 'https://img.leemhoon00.com/1234.png',
      } as UserDto);
      await usersService.uploadProfileImage(userId, file);
      expect(usersService.deleteS3Image).toBeCalled();
    });
  });

  describe('deleteProfileImage', () => {
    const userId = '1234';

    it('usersService.deleteS3Image(), usersRepository.updateProfileImage() 호출', async () => {
      jest.spyOn(usersService, 'deleteS3Image').mockResolvedValue();
      await usersService.deleteProfileImage(userId);
      expect(usersService.deleteS3Image).toBeCalledWith(userId);
      expect(usersRepository.updateProfileImage).toBeCalledWith(
        userId,
        configService.get('DEFAULT_IMAGE'),
      );
    });
  });

  describe('deleteS3Image', () => {
    const userId = '1234';

    const user = {
      image: 'https://img.leemhoon00.com/1234.png',
    } as UserDto;

    it('s3Client.send() 호출', async () => {
      jest.spyOn(usersRepository, 'getUser').mockResolvedValue(user);
      await usersService.deleteS3Image(userId);

      expect(s3Client.send).toBeCalledWith(
        expect.objectContaining({
          input: {
            Bucket: configService.get('BUCKET_NAME'),
            Key: String('images/' + userId + extname(user.image)),
          },
        }),
      );
    });
  });

  describe('getLikesCount', () => {
    it('usersRepository.getLikesCount() 호출', async () => {
      await usersService.getLikesCount();
      expect(usersRepository.getLikesCount).toBeCalled();
    });
  });

  describe('like', () => {
    it('usersRepository.like() 호출', async () => {
      const userId = '1234';
      await usersService.like(userId);
      expect(usersRepository.like).toBeCalledWith(userId);
    });
  });

  describe('unlike', () => {
    it('usersRepository.unlike() 호출', async () => {
      const userId = '1234';
      await usersService.unlike(userId);
      expect(usersRepository.unlike).toBeCalledWith(userId);
    });
  });
});
