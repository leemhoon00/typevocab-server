import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { UsersRepository } from '../users.repository';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import { CloudFrontClient } from '@aws-sdk/client-cloudfront';

describe('users.service', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;
  let configService: ConfigService;
  let s3Client: S3Client;
  let cfClient: CloudFrontClient;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        ConfigService,
        {
          provide: UsersRepository,
          useValue: {
            getUser: jest.fn(),
            deleteUser: jest.fn(),
            updateProfileImage: jest.fn(),
          },
        },
        { provide: S3Client, useValue: { send: jest.fn() } },
        { provide: CloudFrontClient, useValue: { send: jest.fn() } },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    configService = module.get<ConfigService>(ConfigService);
    s3Client = module.get<S3Client>(S3Client);
    cfClient = module.get<CloudFrontClient>(CloudFrontClient);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('deleteUser', () => {
    it('사용자가 기본 이미지가 아니면 S3 이미지를 삭제한다', async () => {
      jest.spyOn(usersRepository, 'getUser').mockResolvedValue({
        image: 'https://example.com/1234.jpg',
      } as any);
      jest.spyOn(usersService, 'deleteS3Image').mockResolvedValue();
      await usersService.deleteUser('1234');
      expect(usersService.deleteS3Image).toBeCalled();
    });
  });

  describe('uploadProfileImage', () => {
    beforeAll(() => {
      jest.spyOn(usersService, 'deleteS3Image').mockResolvedValue();
    });
    afterAll(() => {
      jest.clearAllMocks();
    });

    it('사용자가 기본 이미지가 아니면 S3 이미지를 삭제한다', async () => {
      jest.spyOn(usersRepository, 'getUser').mockResolvedValue({
        image: 'https://example.com/test.jpg',
      } as any);

      await usersService.deleteUser('1234');
      expect(usersService.deleteS3Image).toBeCalled();
    });

    it('S3에 이미지를 업로드 할 때 path형식이 images/{userId}.{extname}이다', async () => {
      await usersService.uploadProfileImage('1234', {
        originalname: 'test.jpg',
        buffer: Buffer.from(''),
        mimetype: 'image/jpeg',
      } as any);
      expect(s3Client.send).toBeCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({
            Key: 'images/1234.jpg',
          }),
        }),
      );
    });

    it('데이터베이스에 이미지 url을 저장할 때 path형식이 {cloudfront_url}/{userId}.{extname}이다', async () => {
      await usersService.uploadProfileImage('1234', {
        originalname: 'test.jpg',
        buffer: Buffer.from(''),
        mimetype: 'image/jpeg',
      } as any);
      expect(usersRepository.updateProfileImage).toBeCalledWith(
        '1234',
        `${configService.get('CLOUDFRONT_URL')}/1234.jpg`,
      );
    });

    it('CloudFront에 invalidation을 요청할 때 DistributionId는 CloudFront_url이고 Items는 /{userId}.{extname}이다', async () => {
      await usersService.uploadProfileImage('1234', {
        originalname: 'test.jpg',
        buffer: Buffer.from(''),
        mimetype: 'image/jpeg',
      } as any);
      expect(cfClient.send).toBeCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({
            DistributionId: configService.get('CLOUDFRONT_ID'),
            InvalidationBatch: expect.objectContaining({
              Paths: expect.objectContaining({
                Items: ['/1234.jpg'],
              }),
            }),
          }),
        }),
      );
    });
  });
});
