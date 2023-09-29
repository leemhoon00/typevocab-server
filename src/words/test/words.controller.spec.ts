import { Test, TestingModule } from '@nestjs/testing';
import { WordsController } from '../words.controller';
import { WordsService } from '../words.service';
import { CreateWordsDto, WordDto } from '../words.dto';

describe('WordsController', () => {
  let wordsController: WordsController;
  let wordsService: WordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WordsController],
      providers: [
        {
          provide: WordsService,
          useValue: {
            create: jest.fn(),
            findAllByVocabularyId: jest.fn(),
            speech: jest.fn().mockResolvedValue({ pipe: jest.fn() }),
          },
        },
      ],
    }).compile();

    wordsController = module.get<WordsController>(WordsController);
    wordsService = module.get<WordsService>(WordsService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('create', () => {
    const createWordsDtoMock: CreateWordsDto = {
      vocabularyId: 1,
      words: [
        { word: 'apple', meaning: '사과' },
        { word: 'banana', meaning: '바나나' },
      ],
    };
    it('should call the create method of the WordsService', async () => {
      await wordsController.create(createWordsDtoMock);

      expect(wordsService.create).toHaveBeenCalledWith(createWordsDtoMock);
    });
  });

  describe('findAllByVocabularyId', () => {
    it('should call the findAllByVocabularyId method of the WordsService', async () => {
      const vocabularyId = 1;
      const expectedWordDtos: WordDto[] = [
        { wordId: 1, word: 'apple', meaning: '사과' },
        { wordId: 2, word: 'banana', meaning: '바나나' },
      ];
      (wordsService.findAllByVocabularyId as jest.Mock).mockResolvedValue(
        expectedWordDtos,
      );

      const actualWordDtos =
        await wordsController.findAllByVocabularyId(vocabularyId);

      expect(actualWordDtos).toEqual(expectedWordDtos);
      expect(wordsService.findAllByVocabularyId).toHaveBeenCalledWith(
        vocabularyId,
      );
    });
  });

  describe('speech', () => {
    const word = 'apple';
    const res = {
      setHeader: jest.fn(),
      send: jest.fn(),
    } as any;
    it('should call the speech method of the WordsService', async () => {
      await wordsController.speech(word, res);

      expect(res.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'application/octet-stream',
      );
      expect(wordsService.speech).toHaveBeenCalledWith(word);
    });
  });
});
