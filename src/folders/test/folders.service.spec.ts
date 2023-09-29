import { Test, TestingModule } from '@nestjs/testing';
import { FoldersService } from '../folders.service';
import { FoldersRepository } from '../folders.repository';
import { CreateFolderDto } from '../folders.dto';

describe('FoldersService', () => {
  let foldersService: FoldersService;
  let foldersRepository: FoldersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FoldersService,
        {
          provide: FoldersRepository,
          useValue: {
            create: jest.fn(),
            findAllFoldersAndVocabulariesByUserId: jest.fn(),
            delete: jest.fn(),
            deleteAllByUserId: jest.fn(),
          },
        },
      ],
    }).compile();

    foldersService = module.get<FoldersService>(FoldersService);
    foldersRepository = module.get<FoldersRepository>(FoldersRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('create', () => {
    const createFolderDtoMock: CreateFolderDto = {
      userId: '123',
      folderName: '해커스 노랭이',
    };

    it('foldersRepository.create(), foldersService.findAllFoldersAndVocabulariesByUserId() 호출', async () => {
      jest.spyOn(foldersService, 'findAllFoldersAndVocabulariesByUserId');
      await foldersService.create(createFolderDtoMock);
      expect(foldersRepository.create).toHaveBeenCalledWith(
        createFolderDtoMock,
      );
      expect(
        foldersService.findAllFoldersAndVocabulariesByUserId,
      ).toHaveBeenCalledWith(createFolderDtoMock.userId);
    });
  });

  describe('findAllFoldersAndVocabulariesByUserId', () => {
    it('foldersRepository.findAllFoldersAndVocabulariesByUserId() 호출', async () => {
      const userIdMock = '123';
      foldersService.findAllFoldersAndVocabulariesByUserId(userIdMock);
      expect(
        foldersRepository.findAllFoldersAndVocabulariesByUserId,
      ).toHaveBeenCalledWith(userIdMock);
    });
  });

  describe('delete', () => {
    it('foldersRepository.delete() 호출', async () => {
      const folderIdMock = 1;
      await foldersService.delete(folderIdMock);
      expect(foldersRepository.delete).toHaveBeenCalledWith(folderIdMock);
    });
  });

  describe('deleteAllFolders', () => {
    it('foldersRepository.deleteAllByUserId() 호출', async () => {
      const userIdMock = '123';
      await foldersService.deleteAllFolders(userIdMock);
      expect(foldersRepository.deleteAllByUserId).toHaveBeenCalledWith(
        userIdMock,
      );
    });
  });
});
