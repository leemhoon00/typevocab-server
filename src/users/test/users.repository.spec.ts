import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from '../users.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { UserDto, UpdateUserInfoDto } from '../users.dto';

describe('UsersRepository', () => {
  let prisma: PrismaService;
  let usersRepository: UsersRepository;

  const userId = 'seedUser';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersRepository, PrismaService],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    usersRepository = module.get<UsersRepository>(UsersRepository);

    await prisma.user.deleteMany();
    await prisma.user.create({ data: { userId } });
    await prisma.folder.create({ data: { userId, folderName: 'folder1' } });
  });

  describe('create', () => {
    it('유저 생성', async () => {
      const userId = '1234';
      const user = { userId } as User;
      await usersRepository.create(userId);
      expect(
        (await prisma.user.findUnique({ where: { userId } })).userId,
      ).toEqual(user.userId);
    });
  });
});
