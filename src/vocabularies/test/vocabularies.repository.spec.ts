import { Test, TestingModule } from '@nestjs/testing';
import { VocabulariesRepository } from '../vocabularies.repository';
import { PrismaService } from 'src/prisma/prisma.service';

describe('vocabularies.repository', () => {
  let prisma: PrismaService;
  let vocabulariesRepository: VocabulariesRepository;
  const userId = 'vocabulariesRepositoryTestUser';

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VocabulariesRepository, PrismaService],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    vocabulariesRepository = module.get<VocabulariesRepository>(
      VocabulariesRepository,
    );
  });

  beforeEach(async () => {
    await prisma.init(userId);
  });

  afterEach(async () => {
    await prisma.reset(userId);
  });

  describe('delete', () => {
    it('vocabulary와 관련된 word가 다 삭제되어야 한다.', async () => {
      const folder = await prisma.folder.findFirst({ where: { userId } });
      const vocabulary = await prisma.vocabulary.findFirst({
        where: { folderId: folder.folderId },
      });
      // 삭제
      await vocabulariesRepository.delete(vocabulary.vocabularyId);
      const deletedWords = await prisma.word.findMany({
        where: { vocabularyId: vocabulary.vocabularyId },
      });

      // 삭제 후 정보 수집
      const deletedVocabulary = await prisma.vocabulary.findUnique({
        where: { vocabularyId: vocabulary.vocabularyId },
      });

      expect(deletedVocabulary).toBeNull();
      expect(deletedWords.length).toBe(0);
    });
  });

  describe('createProblems', () => {
    it('vocabularyIds에 해당하는 word들을 배열형태로 한번에 가져온다', async () => {
      const folder = await prisma.folder.findFirst({ where: { userId } });

      const vocabulary = await prisma.vocabulary.create({
        data: {
          folderId: folder.folderId,
          vocabularyName: 'voca3',
        },
      });
      await prisma.word.createMany({
        data: [
          {
            vocabularyId: vocabulary.vocabularyId,
            word: 'monster',
            meaning: '괴물',
          },
          {
            vocabularyId: vocabulary.vocabularyId,
            word: 'computer',
            meaning: '컴퓨터',
          },
        ],
      });
      const vocabularyIds = await prisma.vocabulary
        .findMany({
          where: { folderId: folder.folderId },
          select: { vocabularyId: true },
        })
        .then((v) => v.map((v) => v.vocabularyId));
      const result = await vocabulariesRepository.createProblems(vocabularyIds);
      expect(result.length).toBe(6);
    });
  });
});
