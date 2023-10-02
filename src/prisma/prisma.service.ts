import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async init(userId: string) {
    const user = await this.user.create({ data: { userId } });
    const folder = await this.folder.create({
      data: { userId: user.userId, folderName: 'folder1' },
    });
    const vocabulary = await this.vocabulary.create({
      data: { folderId: folder.folderId, vocabularyName: 'voca1' },
    });
    await this.word.createMany({
      data: [
        {
          vocabularyId: vocabulary.vocabularyId,
          word: 'apple',
          meaning: '사과',
        },
        {
          vocabularyId: vocabulary.vocabularyId,
          word: 'banana',
          meaning: '바나나',
        },
      ],
    });
  }

  async reset(userId: string) {
    const user = await this.user.findUnique({ where: { userId } });
    if (user) await this.user.delete({ where: { userId } });
  }
}
