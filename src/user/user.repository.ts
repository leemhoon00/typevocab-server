import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto, UserInfoDto, UpdateUserInfoDto } from './users.dto';

export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // async findUserById(userId: Types.ObjectId): Promise<UserDocument> {
  //   return this.userModel.findOne({ _id: userId });
  // }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findUserByKakaoId(id: string): Promise<UserDocument> {
    return this.userModel.findOne({ id });
  }

  async getUser(_id: Types.ObjectId): Promise<UserInfoDto> {
    return await this.userModel.findOne(
      { _id },
      { _id: false, __v: false, id: false, provider: false },
    );
  }

  async updateUserInfo(
    userId: Types.ObjectId,
    updateUserInfoDto: UpdateUserInfoDto,
  ) {
    await this.userModel.updateOne(
      { _id: userId },
      { $set: { ...updateUserInfoDto } },
    );
    return;
  }

  async updateProfileImage(userId: Types.ObjectId, image: string) {
    await this.userModel.updateOne({ _id: userId }, { $set: { image } });
    return;
  }

  async deleteUser(userId: Types.ObjectId) {
    await this.userModel.deleteOne({ _id: userId });
    return;
  }
}
