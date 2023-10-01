import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from '../users.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

describe('users.repository', () => {
  let prisma: PrismaService;
  let usersRepository: UsersRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersRepository, PrismaService],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  beforeEach(async () => {
    await prisma.seed();
  });

  describe('create', () => {
    it('처음 회원가입 시 초기값 검사', async () => {
      const userId = '1234';
      const toBeUser: User = {
        userId,
        name: '',
        email: '',
        bio: '',
        company: '',
        image: 'https://img.leemhoon00.com/default-image.png',
        like: false,
        currentRefreshToken: null,
      };
      await usersRepository.create(userId);
      const user = await prisma.user.findUnique({ where: { userId } });
      expect(user).toEqual(toBeUser);
    });
  });

  describe('getUser', () => {
    it('currentRefreshToken이 없어야 한다.', async () => {
      const userId = 'seedUser';
      const user = (await usersRepository.getUser(userId)) as any;
      expect(user.currentRefreshToken).toBeUndefined();
    });
  });

  describe('deleteUser', () => {
    const userId = 'seedUser';
    it('유저와 관련된 folder, vocabulary, word가 다 삭제되어야 한다.', async () => {
      // 기존 정보 수집
      const folders = await prisma.folder.findMany({
        where: { userId },
      });
      const vocabularies = await prisma.vocabulary.findMany({
        where: { folderId: { in: folders.map((folder) => folder.folderId) } },
      });

      // 삭제
      await usersRepository.deleteUser(userId);

      // 삭제 후 정보 수집
      const user = await prisma.user.findUnique({ where: { userId } });
      const deletedFolders = await prisma.folder.findMany({
        where: { userId },
      });
      const deletedVocabularies = await prisma.vocabulary.findMany({
        where: { folderId: { in: folders.map((folder) => folder.folderId) } },
      });
      const deletedWords = await prisma.word.findMany({
        where: {
          vocabularyId: { in: vocabularies.map((v) => v.vocabularyId) },
        },
      });

      expect(user).toBeNull();
      expect(deletedFolders).toHaveLength(0);
      expect(deletedVocabularies).toHaveLength(0);
      expect(deletedWords).toHaveLength(0);
    });
  });
});
