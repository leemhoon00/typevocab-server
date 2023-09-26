import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { UserDto, UpdateUserInfoDto } from './users.dto';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(userId: string): Promise<User> {
    return await this.prisma.user.create({ data: { userId } });
  }

  async getUser(userId: string): Promise<UserDto> {
    return await this.prisma.user.findUnique({
      where: { userId: userId },
      select: {
        userId: true,
        name: true,
        email: true,
        bio: true,
        company: true,
        image: true,
        like: true,
      },
    });
  }

  async updateUserInfo(
    userId: string,
    updateUserInfoDto: UpdateUserInfoDto,
  ): Promise<void> {
    await this.prisma.user.update({
      where: { userId },
      data: updateUserInfoDto,
    });
    return;
  }

  async updateProfileImage(userId: string, image: string): Promise<void> {
    await this.prisma.user.update({
      where: { userId },
      data: { image },
    });
    return;
  }

  async deleteUser(userId: string): Promise<void> {
    await this.prisma.user.delete({ where: { userId } });
  }

  async getLikesCount(): Promise<number> {
    return await this.prisma.user.count({ where: { like: true } });
  }

  async like(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { userId },
      data: { like: true },
    });
    return;
  }

  async unlike(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { userId },
      data: { like: false },
    });
  }

  async setCurrentRefreshToken(
    userId: string,
    currentRefreshToken: string,
  ): Promise<void> {
    await this.prisma.user.update({
      where: { userId },
      data: { currentRefreshToken },
    });
    return;
  }

  async getUserWithCurrentRefreshToken(userId: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: { userId },
    });
  }

  async logout(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { userId },
      data: { currentRefreshToken: null },
    });
    return;
  }
}
