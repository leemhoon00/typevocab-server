import { Test, TestingModule } from '@nestjs/testing';
import { WordsService } from '../words.service';
import { WordsRepository } from '../words.repository';
import { PollyClient } from '@aws-sdk/client-polly';
import { HttpException } from '@nestjs/common';

describe('words.service', () => {
  let wordsService: WordsService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        WordsService,
        {
          provide: WordsRepository,
          useValue: {},
        },
        {
          provide: PollyClient,
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    wordsService = moduleRef.get(WordsService);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('speech', () => {
    it('word가 공백이면 HttpException을 던진다', () => {
      const word = ' ';
      expect(() => wordsService.speech(word)).rejects.toThrow(HttpException);
    });
    it('word가 알파벳이 아니면 HttpException을 던진다', () => {
      const word = '한글';
      expect(() => wordsService.speech(word)).rejects.toThrow(HttpException);
    });
  });
});
