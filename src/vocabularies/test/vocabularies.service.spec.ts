import { Test, TestingModule } from '@nestjs/testing';
import { VocabulariesService } from '../vocabularies.service';
import { VocabulariesRepository } from '../vocabularies.repository';
import { CreateVocabularyDto, CreateProblemsDto } from '../vocabularies.dto';
import { WordDto } from 'src/words/words.dto';

describe('VocabulariesService', () => {
  let vocabulariesService: VocabulariesService;
  let vocabulariesRepository: VocabulariesRepository;

  const wordDtoMock: WordDto[] = [
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
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VocabulariesService,
        {
          provide: VocabulariesRepository,
          useValue: {
            create: jest.fn(),
            createProblems: jest.fn().mockResolvedValue(wordDtoMock),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    vocabulariesService = module.get<VocabulariesService>(VocabulariesService);
    vocabulariesRepository = module.get<VocabulariesRepository>(
      VocabulariesRepository,
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('create', () => {
    const createVocabularyDtoMock: CreateVocabularyDto = {
      folderId: 1,
      vocabularyName: 'Day-1',
    };
    it('vocabulariesRepository의 create 메소드 실행 유무', async () => {
      await vocabulariesService.create(createVocabularyDtoMock);
      expect(vocabulariesRepository.create).toHaveBeenCalledWith(
        createVocabularyDtoMock,
      );
    });
  });

  describe('createProblems', () => {
    const createProblemsDtoRandomMock: CreateProblemsDto = {
      vocabularyIds: [1, 2],
      isRandom: true,
    };
    const createProblemsDtoNotRandomMock: CreateProblemsDto = {
      vocabularyIds: [1, 2],
      isRandom: false,
    };
    it('isRandom: true - sort 실행 해야함', async () => {
      jest.spyOn(wordDtoMock, 'sort');
      await vocabulariesService.createProblems(createProblemsDtoRandomMock);
      expect(vocabulariesRepository.createProblems).toHaveBeenCalledWith(
        createProblemsDtoRandomMock.vocabularyIds,
      );
      expect(wordDtoMock.sort).toHaveBeenCalled();
    });

    it('isRandom: false - sort 실행 하면 안됨', async () => {
      jest.spyOn(wordDtoMock, 'sort');
      await vocabulariesService.createProblems(createProblemsDtoNotRandomMock);
      expect(vocabulariesRepository.createProblems).toHaveBeenCalledWith(
        createProblemsDtoNotRandomMock.vocabularyIds,
      );
      expect(wordDtoMock.sort).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    const vocabularyIdMock = 1;
    it('vocabulariesRepository의 delete 메소드 실행 유무', async () => {
      await vocabulariesService.delete(vocabularyIdMock);
      expect(vocabulariesRepository.delete).toHaveBeenCalledWith(
        vocabularyIdMock,
      );
    });
  });
});
