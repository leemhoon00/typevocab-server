import { Injectable } from '@nestjs/common';
import { WordsRepository } from './words.repository';
import { CreateWordsDto, WordDto } from './words.dto';
import { Types } from 'mongoose';
import { Response } from 'express';
import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';

@Injectable()
export class WordsService {
  constructor(
    private readonly wordsRepository: WordsRepository,
    private readonly pollyClient: PollyClient,
  ) {}

  async create(createWordsDto: CreateWordsDto): Promise<void> {
    return this.wordsRepository.create(createWordsDto);
  }

  async findAllByVocabularyId(
    vocabularyId: Types.ObjectId,
  ): Promise<WordDto[]> {
    return await this.wordsRepository.findAllByVocabularyId(vocabularyId);
  }

  async speech(word: string, res: Response) {
    const command = new SynthesizeSpeechCommand({
      Engine: 'standard',
      LanguageCode: 'en-US',
      OutputFormat: 'mp3',
      Text: word,
      TextType: 'text',
      VoiceId: 'Joanna',
    });
    const response = await this.pollyClient.send(command);
    const audioStream = response.AudioStream as any;
    res.setHeader('Content-Type', 'application/octet-stream');
    audioStream.pipe(res);
  }
}
