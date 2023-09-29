import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { WordsRepository } from '../words.repository';
import { CreateWordsDto } from '../words.dto';

describe('WordsRepository', () => {
  let wordsRepository: WordsRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WordsRepository,
        {
          provide: PrismaService,
          useValue: {
            word: {
              findMany: jest.fn(),
              deleteMany: jest.fn(),
              createMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    wordsRepository = module.get<WordsRepository>(WordsRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('create', () => {
    const createWordsDtoMock: CreateWordsDto = {
      vocabularyId: 1,
      words: [
        { word: 'apple', meaning: '사과' },
        {
          word: 'banana',
          meaning: '바나나',
        },
      ],
    };
    it('should delete existing words and create new words', async () => {
      await wordsRepository.create(createWordsDtoMock);

      expect(prismaService.word.deleteMany).toHaveBeenCalledWith({
        where: { vocabularyId: createWordsDtoMock.vocabularyId },
      });
      expect(prismaService.word.createMany).toHaveBeenCalledWith({
        data: [
          {
            vocabularyId: createWordsDtoMock.vocabularyId,
            word: createWordsDtoMock.words[0].word,
            meaning: createWordsDtoMock.words[0].meaning,
          },
          {
            vocabularyId: createWordsDtoMock.vocabularyId,
            word: createWordsDtoMock.words[1].word,
            meaning: createWordsDtoMock.words[1].meaning,
          },
        ],
      });
    });
  });

  describe('findAllByVocabularyId', () => {
    it('should return an array of WordDto objects', async () => {
      const vocabularyId = 1;
      const expectedWordDtos = [
        { wordId: 1, word: 'apple', meaning: '사과' },
        {
          wordId: 2,
          word: 'banana',
          meaning: '바나나',
        },
      ];
      (prismaService.word.findMany as jest.Mock).mockResolvedValue(
        expectedWordDtos,
      );

      const actualWordDtos =
        await wordsRepository.findAllByVocabularyId(vocabularyId);

      expect(actualWordDtos).toEqual(expectedWordDtos);
      expect(prismaService.word.findMany).toHaveBeenCalledWith({
        where: { vocabularyId },
        select: { wordId: true, word: true, meaning: true },
      });
    });
  });
});
