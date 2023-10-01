import { Test, TestingModule } from '@nestjs/testing';
import { WordsRepository } from '../words.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWordsDto } from '../words.dto';

describe('words.repository', () => {
  let prisma: PrismaService;
  let wordsRepository: WordsRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WordsRepository, PrismaService],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    wordsRepository = module.get<WordsRepository>(WordsRepository);
  });

  beforeEach(async () => {
    await prisma.seed();
  });

  describe('create', () => {
    it('기존 단어장을 덮어 씌우고 새로 생성한다.', async () => {
      const createWordsDto: CreateWordsDto = {
        vocabularyId: 1,
        words: [
          { word: 'computer', meaning: '컴퓨터' },
          { word: 'water', meaning: '물' },
          { word: 'monster', meaning: '괴물' },
        ],
      };
      await wordsRepository.create(createWordsDto);
      const words = await prisma.word.findMany({
        where: { vocabularyId: createWordsDto.vocabularyId },
      });
      expect(words.length).toBe(3);
    });
  });

  describe('findAllByVocabularyId', () => {
    const vocabularyId = 1;

    it('단어장의 모든 단어를 배열로 반환한다.', async () => {
      const words = await wordsRepository.findAllByVocabularyId(vocabularyId);
      expect(words.length).toBe(2);
    });
  });
});
