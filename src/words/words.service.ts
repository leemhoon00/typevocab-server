import { Injectable, HttpException } from '@nestjs/common';
import { WordsRepository } from './words.repository';
import { CreateWordsDto, WordDto } from './words.dto';
import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';
import { isAlphabeticalString, hasNoWhitespace } from 'src/common/util';

@Injectable()
export class WordsService {
  constructor(
    private readonly wordsRepository: WordsRepository,
    private readonly pollyClient: PollyClient,
  ) {}

  async create(createWordsDto: CreateWordsDto): Promise<void> {
    return this.wordsRepository.create(createWordsDto);
  }

  async findAllByVocabularyId(vocabularyId: number): Promise<WordDto[]> {
    return await this.wordsRepository.findAllByVocabularyId(vocabularyId);
  }

  async speech(word: string): Promise<any> {
    if (!isAlphabeticalString(word) || !hasNoWhitespace(word)) {
      throw new HttpException(
        'word must be alphabetical string without whitespace',
        400,
      );
    }
    const command = new SynthesizeSpeechCommand({
      Engine: 'standard',
      LanguageCode: 'en-US',
      OutputFormat: 'mp3',
      Text: word,
      TextType: 'text',
      VoiceId: 'Joanna',
    });

    const response = await this.pollyClient.send(command);
    return response.AudioStream as any;
  }
}
