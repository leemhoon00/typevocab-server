import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from '../users.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { UserDto, UpdateUserInfoDto } from '../users.dto';

describe('UsersRepository', () => {
  let prisma: PrismaService;
  let usersRepository: UsersRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersRepository, PrismaService],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    usersRepository = module.get<UsersRepository>(UsersRepository);

    await prisma.seed();
  });

  afterEach(async () => {
    await prisma.seed();
  });

  describe('create', () => {
    it('유저 생성 성공', async () => {
      const userId = '1234';
      const user = await usersRepository.create(userId);
      expect(user.userId).toEqual(userId);
    });
  });
});
