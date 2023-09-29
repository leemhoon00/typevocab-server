import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { VocabulariesRepository } from '../vocabularies.repository';
import { CreateVocabularyDto } from '../vocabularies.dto';
import { Word } from '@prisma/client';

describe('VocabulariesRepository', () => {
  let vocabulariesRepository: VocabulariesRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VocabulariesRepository,
        {
          provide: PrismaService,
          useValue: {
            vocabulary: {
              create: jest.fn(),
              delete: jest.fn(),
            },
            word: {
              findMany: jest.fn().mockResolvedValue([
                {
                  wordId: 1,
                  vocabularyId: 1,
                  word: 'apple',
                  meaning: '사과',
                },
                {
                  wordId: 2,
                  vocabularyId: 2,
                  word: 'banana',
                  meaning: '바나나',
                },
              ]),
            },
          },
        },
      ],
    }).compile();

    vocabulariesRepository = module.get<VocabulariesRepository>(
      VocabulariesRepository,
    );
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('create', () => {
    const createVocabularyDtoMock: CreateVocabularyDto = {
      folderId: 1,
      vocabularyName: 'Day-1',
    };
    it('should call the create method of the PrismaService', async () => {
      await vocabulariesRepository.create(createVocabularyDtoMock);

      expect(prismaService.vocabulary.create).toHaveBeenCalledWith({
        data: createVocabularyDtoMock,
      });
    });
  });

  describe('delete', () => {
    const vocabularyIdMock = 1;
    it('should call the delete method of the PrismaService', async () => {
      await vocabulariesRepository.delete(vocabularyIdMock);

      expect(prismaService.vocabulary.delete).toHaveBeenCalledWith({
        where: { vocabularyId: vocabularyIdMock },
      });
    });
  });

  describe('createProblems', () => {
    const vocabularyIdsMock = [1, 2];
    const wordsMock: Word[] = [
      {
        wordId: 1,
        vocabularyId: 1,
        word: 'apple',
        meaning: '사과',
      },
      {
        wordId: 2,
        vocabularyId: 2,
        word: 'banana',
        meaning: '바나나',
      },
    ];
    it('should call the findMany method of the PrismaService', async () => {
      const result =
        await vocabulariesRepository.createProblems(vocabularyIdsMock);

      expect(prismaService.word.findMany).toHaveBeenCalledWith({
        where: { vocabularyId: { in: vocabularyIdsMock } },
      });
      expect(result).toEqual(wordsMock);
    });
  });
});
