import { Test, TestingModule } from '@nestjs/testing';
import { VocabulariesRepository } from '../vocabularies.repository';
import { PrismaService } from 'src/prisma/prisma.service';

describe('vocabularies.repository', () => {
  let prisma: PrismaService;
  let vocabulariesRepository: VocabulariesRepository;

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
    await prisma.seed();
  });

  describe('delete', () => {
    const vocabularyId = 1;
    it('vocabulary와 관련된 word가 다 삭제되어야 한다.', async () => {
      // 삭제
      await vocabulariesRepository.delete(vocabularyId);
      const deletedWords = await prisma.word.findMany({
        where: { vocabularyId },
      });

      // 삭제 후 정보 수집
      const deletedVocabulary = await prisma.vocabulary.findUnique({
        where: { vocabularyId },
      });

      expect(deletedVocabulary).toBeNull();
      expect(deletedWords.length).toBe(0);
    });
  });

  describe('createProblems', () => {
    it('vocabularyIds에 해당하는 word들을 배열형태로 한번에 가져온다', async () => {
      const vocabularyIds = [1, 2];
      await prisma.vocabulary.create({
        data: {
          folderId: 1,
          vocabularyName: 'voca2',
        },
      });
      await prisma.word.createMany({
        data: [
          { vocabularyId: 2, word: 'monster', meaning: '괴물' },
          { vocabularyId: 2, word: 'computer', meaning: '컴퓨터' },
        ],
      });
      const result = await vocabulariesRepository.createProblems(vocabularyIds);
      expect(result.length).toBe(4);
    });
  });
});
