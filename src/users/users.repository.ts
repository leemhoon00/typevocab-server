import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto, UserDto, UpdateUserInfoDto } from './users.dto';

export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findUserByKakaoId(kakaoId: number): Promise<UserDocument> {
    return this.userModel.findOne({ kakaoId });
  }

  async getUser(userId: Types.ObjectId): Promise<UserDto> {
    return await this.userModel.findOne(
      { _id: userId },
      { currentRefreshToken: 0 },
    );
  }

  async updateUserInfo(
    userId: Types.ObjectId,
    updateUserInfoDto: UpdateUserInfoDto,
  ): Promise<void> {
    await this.userModel.updateOne(
      { _id: userId },
      { $set: { ...updateUserInfoDto } },
    );
    return;
  }

  async updateProfileImage(
    userId: Types.ObjectId,
    image: string,
  ): Promise<void> {
    await this.userModel.updateOne({ _id: userId }, { $set: { image } });
    return;
  }

  async deleteUser(userId: Types.ObjectId): Promise<void> {
    await this.userModel.deleteOne({ _id: userId });
    return;
  }

  async getLikesCount(): Promise<number> {
    return await this.userModel.countDocuments({ like: true });
  }

  async like(userId: Types.ObjectId): Promise<void> {
    await this.userModel.updateOne({ _id: userId }, { $set: { like: true } });
    return;
  }

  async unlike(userId: Types.ObjectId): Promise<void> {
    await this.userModel.updateOne({ _id: userId }, { $set: { like: false } });
    return;
  }

  async setCurrentRefreshToken(
    userId: Types.ObjectId,
    currentRefreshToken: string,
  ): Promise<void> {
    await this.userModel.updateOne(
      { _id: userId },
      { $set: { currentRefreshToken } },
    );
    return;
  }

  async getUserWithCurrentRefreshToken(
    userId: Types.ObjectId,
  ): Promise<UserDocument> {
    return await this.userModel.findOne({
      _id: userId,
    });
  }
}
