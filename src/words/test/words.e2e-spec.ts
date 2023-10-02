import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { WordsController } from '../words.controller';
import { WordsService } from '../words.service';
import { WordsRepository } from '../words.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PollyClient } from '@aws-sdk/client-polly';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { PrismaService } from 'src/prisma/prisma.service';

describe('WordsController (e2e)', () => {
  const userId = 'words-e2e-spec-user-id';
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
        ConfigModule.forRoot({
          isGlobal: true,
          expandVariables: true,
        }),
      ],
      controllers: [WordsController],
      providers: [PollyClient, WordsService, WordsRepository, JwtStrategy],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    await app.init();

    jwtService = moduleFixture.get<JwtService>(JwtService);
    prisma = moduleFixture.get<PrismaService>(PrismaService);

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

  it('POST /words - 단어장에 단어생성', async () => {
    const folder = await prisma.folder.findFirst({ where: { userId } });
    const vocabulary = await prisma.vocabulary.findFirst({
      where: { folderId: folder.folderId },
    });

    await request(app.getHttpServer())
      .post('/words')
      .set('Cookie', `accessToken=${accessToken}`)
      .send({
        vocabularyId: vocabulary.vocabularyId,
        words: [
          {
            word: 'computer',
            meaning: '컴퓨터',
          },
          {
            word: 'monster',
            meaning: '괴물',
          },
          {
            word: 'apple',
            meaning: '사과',
          },
        ],
      })
      .expect(201);

    const words = await prisma.word.findMany({
      where: { vocabularyId: vocabulary.vocabularyId },
    });
    expect(words.length).toBe(3);
  });

  it('GET /words - 단어장에 있는 단어조회', async () => {
    const folder = await prisma.folder.findFirst({ where: { userId } });
    const vocabulary = await prisma.vocabulary.findFirst({
      where: { folderId: folder.folderId },
    });

    const result = await request(app.getHttpServer())
      .get(`/words?vocabularyId=${vocabulary.vocabularyId}`)
      .set('Cookie', `accessToken=${accessToken}`)
      .expect(200);

    expect(result.body.length).toBe(2);
  });

  it('GET /words/:word - 단어 발음', async () => {
    await request(app.getHttpServer())
      .get(`/words/apple`)
      .set('Cookie', `accessToken=${accessToken}`)
      .expect(200)
      .expect('Content-Type', 'application/octet-stream');
  });
});
