import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as cookieParser from 'cookie-parser';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import * as request from 'supertest';
import { FoldersController } from '../folders.controller';
import { FoldersRepository } from '../folders.repository';
import { FoldersService } from '../folders.service';

describe('FoldersController (e2e)', () => {
  const userId = 'folders-e2e-spec-user-id';
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
      controllers: [FoldersController],
      providers: [FoldersService, FoldersRepository, JwtStrategy],
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

  it('POST /folders - 새 폴더 생성', async () => {
    await request(app.getHttpServer())
      .post('/folders')
      .set('Cookie', `accessToken=${accessToken}`)
      .send({ folderName: 'folder2' })
      .expect(201)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              folderId: expect.any(Number),
              folderName: 'folder2',
              vocabularies: [],
            }),
          ]),
        );
      });
  });

  it('GET /folders - 폴더와 단어장 조회', async () => {
    await request(app.getHttpServer())
      .get('/folders')
      .set('Cookie', `accessToken=${accessToken}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toEqual([
          expect.objectContaining({
            folderId: expect.any(Number),
            folderName: 'folder1',
            vocabularies: [
              {
                folderId: expect.any(Number),
                vocabularyId: expect.any(Number),
                vocabularyName: 'voca1',
              },
              {
                folderId: expect.any(Number),
                vocabularyId: expect.any(Number),
                vocabularyName: 'voca2',
              },
            ],
          }),
        ]);
      });
  });

  describe('DELETE /folders/:folderId - 폴더 삭제', () => {
    it('폴더와 관련된 단어장, 단어들이 모두 삭제된다.', async () => {
      const folder = await prisma.folder.findFirst({ where: { userId } });
      const vocabularies = await prisma.vocabulary.findMany({
        where: { folderId: folder.folderId },
      });
      await request(app.getHttpServer())
        .delete(`/folders/${folder.folderId}`)
        .set('Cookie', `accessToken=${accessToken}`)
        .expect(204);

      const deletedFolder = await prisma.folder.findFirst({
        where: { userId },
      });
      expect(deletedFolder).toBeNull();

      const deletedVocabularies = await prisma.vocabulary.findMany({
        where: { folderId: folder.folderId },
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
});
