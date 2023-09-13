import { IsString, IsMongoId } from 'class-validator';

export class FolderIdParam {
  @IsMongoId()
  folderId: string;
}

export class VocabularyIdParam {
  @IsMongoId()
  vocabularyId: string;
}

export class WordParam {
  @IsString()
  word: string;
}
