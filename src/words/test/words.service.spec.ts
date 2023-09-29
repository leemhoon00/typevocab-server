import { Test, TestingModule } from '@nestjs/testing';
import { WordsRepository } from '../words.repository';
import { WordsService } from '../words.service';
import { CreateWordsDto, WordDto } from '../words.dto';
import { PollyClient } from '@aws-sdk/client-polly';

describe('WordsService', () => {
  let wordsService: WordsService;
  let wordsRepository: WordsRepository;
  let pollyClient: PollyClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WordsService,
        {
          provide: WordsRepository,
          useValue: {
            create: jest.fn(),
            findAllByVocabularyId: jest.fn(),
          },
        },
        {
          provide: PollyClient,
          useValue: {
            send: jest.fn().mockResolvedValue({ AudioStream: 'audioStream' }),
          },
        },
      ],
    }).compile();

    wordsService = module.get<WordsService>(WordsService);
    wordsRepository = module.get<WordsRepository>(WordsRepository);
    pollyClient = module.get<PollyClient>(PollyClient);
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
    it('wordsRepository.create() 실행 유무', async () => {
      await wordsService.create(createWordsDtoMock);

      expect(wordsRepository.create).toHaveBeenCalledWith(createWordsDtoMock);
    });
  });

  describe('findAllByVocabularyId', () => {
    it('wordsRepository.findAllByVocabularyId() 실행 유무', async () => {
      const vocabularyId = 1;
      const expectedWordDtos: WordDto[] = [
        { wordId: 1, word: 'apple', meaning: '사과' },
        { wordId: 2, word: 'banana', meaning: '바나나' },
      ];
      (wordsRepository.findAllByVocabularyId as jest.Mock).mockResolvedValue(
        expectedWordDtos,
      );

      const actualWordDtos =
        await wordsService.findAllByVocabularyId(vocabularyId);

      expect(actualWordDtos).toEqual(expectedWordDtos);
      expect(wordsRepository.findAllByVocabularyId).toHaveBeenCalledWith(
        vocabularyId,
      );
    });
  });

  describe('speech', () => {
    const word = 'hello';
    it('pollyClient.send() 인자에 Text가 잘 들어가는지 테스트', async () => {
      await wordsService.speech(word);

      expect(pollyClient.send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: {
            Engine: 'standard',
            LanguageCode: 'en-US',
            OutputFormat: 'mp3',
            Text: word,
            TextType: 'text',
            VoiceId: 'Joanna',
          },
        }),
      );
    });
  });
});
