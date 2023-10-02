import { Test, TestingModule } from '@nestjs/testing';
import { FoldersRepository } from '../folders.repository';
import { PrismaService } from 'src/prisma/prisma.service';

describe('folders.repository', () => {
  let prisma: PrismaService;
  let foldersRepository: FoldersRepository;
  const userId = 'foldersRepositoryTestUser';

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FoldersRepository, PrismaService],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    foldersRepository = module.get<FoldersRepository>(FoldersRepository);
  });

  beforeEach(async () => {
    await prisma.init(userId);
  });

  afterEach(async () => {
    await prisma.reset(userId);
  });

  describe('delete', () => {
    it('folder와 관련된 vocabulary, word가 다 삭제되어야 한다.', async () => {
      const folder = await prisma.folder.findFirst({ where: { userId } });

      // 기존 정보 수집
      const vocabularies = await prisma.vocabulary.findMany({
        where: { folderId: folder.folderId },
      });

      // 삭제
      await foldersRepository.delete(folder.folderId);

      const deletedFolder = await prisma.folder.findUnique({
        where: { folderId: folder.folderId },
      });
      const deletedVocabularies = await prisma.vocabulary.findMany({
        where: { folderId: folder.folderId },
      });
      const deletedWords = await prisma.word.findMany({
        where: {
          vocabularyId: { in: vocabularies.map((v) => v.vocabularyId) },
        },
      });

      expect(deletedFolder).toBeNull();
      expect(deletedVocabularies).toHaveLength(0);
      expect(deletedWords).toHaveLength(0);
    });
  });
});
