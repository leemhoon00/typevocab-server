import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from '../users.service';
import { UsersController } from '../users.controller';
import { UsersRepository } from '../users.repository';
import { S3Client } from '@aws-sdk/client-s3';
import { CloudFrontClient } from '@aws-sdk/client-cloudfront';
import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';

describe('UsersController (e2e)', () => {
  const userId = 'users-e2e-spec-user-id';
  let app: INestApplication;
  let jwtService: JwtService;
  let prisma: PrismaService;
  let accessToken: string;
  let usersService: UsersService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get('JWT_SECRET'),
            signOptions: {
              expiresIn: configService.get('JWT_EXPIRES_IN'),
            },
          }),
          inject: [ConfigService],
        }),
        ConfigModule.forRoot({
          isGlobal: true,
          expandVariables: true,
        }),
      ],
      controllers: [UsersController],
      providers: [
        UsersService,
        UsersRepository,
        JwtStrategy,
        S3Client,
        CloudFrontClient,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    await app.init();

    jwtService = moduleFixture.get<JwtService>(JwtService);
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    usersService = moduleFixture.get<UsersService>(UsersService);

    accessToken = jwtService.sign({ userId });
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await prisma.init(userId);
  });

  afterEach(async () => {
    await prisma.reset(userId);
  });

  it('GET /users - 유저 정보 가져오기', async () => {
    await prisma.user.update({
      where: { userId },
      data: {
        name: 'testUser',
        email: 'testUser@example.com',
        bio: '안녕하세요',
        company: '인프런',
      },
    });

    await request(app.getHttpServer())
      .get('/users')
      .set('Cookie', `accessToken=${accessToken}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toEqual({
          userId,
          name: 'testUser',
          email: 'testUser@example.com',
          bio: '안녕하세요',
          company: '인프런',
          image: 'https://img.leemhoon00.com/default-image.png',
          like: false,
        });
      });
  });

  it('PUT /users - 유저 정보 수정하기', async () => {
    const testData = {
      name: 'testUser',
      email: 'testUser@example.com',
      bio: '안녕하세요',
      company: '인프런',
    };
    await request(app.getHttpServer())
      .put('/users')
      .set('Cookie', `accessToken=${accessToken}`)
      .send(testData);

    const user = await prisma.user.findUnique({ where: { userId } });
    expect(user).toEqual(
      expect.objectContaining({
        ...testData,
      }),
    );
  });

  describe('DELETE /users - 유저 탈퇴하기', () => {
    it('유저와 관련된 폴더, 단어장, 단어들이 모두 삭제된다', async () => {
      jest.spyOn(usersService, 'deleteS3Image').mockResolvedValue();
      const folders = await prisma.folder.findMany({ where: { userId } });
      const vocabularies = await prisma.vocabulary.findMany({
        where: { folderId: { in: folders.map((folder) => folder.folderId) } },
      });

      await request(app.getHttpServer())
        .delete('/users')
        .set('Cookie', `accessToken=${accessToken}`)
        .expect(204);

      const deletedUser = await prisma.user.findUnique({ where: { userId } });
      expect(deletedUser).toBeNull();

      const deletedFolders = await prisma.folder.findMany({
        where: { userId },
      });
      expect(deletedFolders).toHaveLength(0);

      const deletedVocabularies = await prisma.vocabulary.findMany({
        where: { folderId: { in: folders.map((folder) => folder.folderId) } },
      });
      expect(deletedVocabularies).toHaveLength(0);

      const deletedWords = await prisma.word.findMany({
        where: {
          vocabularyId: { in: vocabularies.map((v) => v.vocabularyId) },
        },
      });
      expect(deletedWords).toHaveLength(0);
    });
  });

  it('GET /users/likes - 좋아요 개수', async () => {
    await prisma.user.update({
      where: { userId },
      data: { like: true },
    });

    await request(app.getHttpServer())
      .get('/users/likes')
      .set('Cookie', `accessToken=${accessToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.text).toBe('1');
      });
  });

  it('POST /users/likes - 좋아요', async () => {
    await request(app.getHttpServer())
      .post('/users/likes')
      .set('Cookie', `accessToken=${accessToken}`)
      .expect(201);

    const user = await prisma.user.findUnique({ where: { userId } });
    expect(user.like).toBe(true);
  });

  it('DELETE /users/likes - 좋아요 취소', async () => {
    await prisma.user.update({
      where: { userId },
      data: { like: true },
    });

    await request(app.getHttpServer())
      .delete('/users/likes')
      .set('Cookie', `accessToken=${accessToken}`)
      .expect(204);

    const user = await prisma.user.findUnique({ where: { userId } });
    expect(user.like).toBe(false);
  });
});
