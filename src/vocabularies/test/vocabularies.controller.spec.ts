import { Test, TestingModule } from '@nestjs/testing';
import { VocabulariesController } from '../vocabularies.controller';
import { VocabulariesService } from '../vocabularies.service';
import { CreateVocabularyDto, CreateProblemsDto } from '../vocabularies.dto';
import { WordDto } from 'src/words/words.dto';

describe('VocabulariesController', () => {
  let vocabulariesController: VocabulariesController;
  let vocabulariesService: VocabulariesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VocabulariesController],
      providers: [
        {
          provide: VocabulariesService,
          useValue: {
            create: jest.fn(),
            createProblems: jest.fn(),
          },
        },
      ],
    }).compile();

    vocabulariesController = module.get<VocabulariesController>(
      VocabulariesController,
    );
    vocabulariesService = module.get<VocabulariesService>(VocabulariesService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('createVocabulary', () => {
    const createVocabularyDtoMock: CreateVocabularyDto = {
      folderId: 1,
      vocabularyName: 'Day-1',
    };

    it('vocabulariesSerivce.create() 호출', async () => {
      await vocabulariesController.createVocabulary(createVocabularyDtoMock);
      expect(vocabulariesService.create).toBeCalledWith(
        createVocabularyDtoMock,
      );
    });
  });

  describe('createProblems', () => {
    beforeEach(() => {
      jest
        .spyOn(vocabulariesService, 'createProblems')
        .mockResolvedValue(wordsDtoMock);
    });
    const createProblemsDtoMock: CreateProblemsDto = {
      isRandom: true,
      vocabularyIds: [1, 2, 3],
    };

    const wordsDtoMock: WordDto[] = [
      {
        wordId: 1,
        word: 'apple',
        meaning: '사과',
      },
      {
        wordId: 2,
        word: 'banana',
        meaning: '바나나',
      },
      {
        wordId: 3,
        word: 'cherry',
        meaning: '체리',
      },
    ];

    it('vocabulariesSerivce.createProblems() 호출', async () => {
      const result = await vocabulariesController.createProblems(
        createProblemsDtoMock,
      );
      expect(vocabulariesService.createProblems).toBeCalledWith(
        createProblemsDtoMock,
      );

      expect(result).toEqual(wordsDtoMock);
    });
  });
});
