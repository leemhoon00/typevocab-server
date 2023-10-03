import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { VocabulariesController } from '../vocabularies.controller';
import { VocabulariesService } from '../vocabularies.service';
import { VocabulariesRepository } from '../vocabularies.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { PrismaService } from 'src/prisma/prisma.service';

describe('VocabulariesController (e2e)', () => {
  const userId = 'vocabularies-e2e-spec-user-id';
  let app: INestApplication;
  let jwtService: JwtService;
  let accessToken: string;
  let prisma: PrismaService;

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
        ConfigModule,
      ],
      controllers: [VocabulariesController],
      providers: [VocabulariesService, VocabulariesRepository, JwtStrategy],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    await app.init();

    jwtService = moduleFixture.get<JwtService>(JwtService);
    prisma = moduleFixture.get<PrismaService>(PrismaService);

    accessToken = jwtService.sign({ userId });
  });

  afterAll(() => {
    app.close();
  });

  beforeEach(async () => {
    await prisma.init(userId);
  });

  afterEach(async () => {
    await prisma.reset(userId);
  });

  it('POST /vocabularies - 단어장 생성', async () => {
    const folder = await prisma.folder.findFirst({
      where: { userId },
    });
    await request(app.getHttpServer())
      .post('/vocabularies')
      .set('Cookie', `accessToken=${accessToken}`)
      .send({ folderId: folder.folderId, vocabularyName: 'test' })
      .expect(201);

    const vocabulary = await prisma.vocabulary.findFirst({
      where: { vocabularyName: 'test' },
    });
    expect(vocabulary).toBeTruthy();
  });

  it('POST /vocabularies/problems - 문제 생성', async () => {
    const folder = await prisma.folder.findFirst({
      where: { userId },
    });
    const vocabularies = await prisma.vocabulary.findMany({
      where: { folderId: folder.folderId },
    });

    await request(app.getHttpServer())
      .post('/vocabularies/problems')
      .set('Cookie', `accessToken=${accessToken}`)
      .send({
        isRandom: true,
        vocabularyIds: vocabularies.map((v) => v.vocabularyId),
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveLength(4);
      });
  });

  describe('DELETE /vocabularies/:vocabularyId - 단어장 삭제', () => {
    it('단어장과 관련된 단어가 모두 삭제된다.', async () => {
      const folder = await prisma.folder.findFirst({
        where: { userId },
      });
      const vocabulary = await prisma.vocabulary.findFirst({
        where: { folderId: folder.folderId },
      });

      await request(app.getHttpServer())
        .delete(`/vocabularies/${vocabulary.vocabularyId}`)
        .set('Cookie', `accessToken=${accessToken}`)
        .expect(204);

      const words = await prisma.word.findMany({
        where: { vocabularyId: vocabulary.vocabularyId },
      });
      expect(words).toHaveLength(0);
    });
  });
});
