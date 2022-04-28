import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationParams } from 'src/common/commonDto/pagination.dto';

import { BaseInterfaceRepository } from 'ifmcommon';
import { UserNotFountException } from '../../common/notFoundExceptions/user.not.found.exception';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

import { User } from '../entities/user.entity';

/**
 * User Repository For Database Reactions
 */
@Injectable()
export class UserRepository implements BaseInterfaceRepository<User> {
  /**
   * Inject Mongoose User Model
   */
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  /**
   * Find one by userId
   */
  async findOneById(id: string): Promise<User> {
    const user = await this.userModel.findOne({ userId: id }).exec();
    if (!user) {
      throw new UserNotFountException(id);
    }

    return user;
  }

  /**
   * Find All User with Pagination
   */
  async findAll(data: PaginationParams) {
    let { page, limit } = data;
    page = page || 0;
    limit = limit || 5;
    const orderBy = data.orderBy || 'ascending';
    const orderByColumn = data.orderByColumn || 'createdAt';

    const count = parseInt((await this.userModel.find().count()).toString());
    const pagecount = Math.ceil(count / limit);
    let pg = parseInt(page.toString());
    const lmt = parseInt(limit.toString());
    if (pg > pagecount) {
      pg = pagecount;
    }
    let skip = pg * lmt;
    if (skip >= count) {
      skip = count - lmt;
      if (skip < 0) {
        skip = 0;
      }
    }
    const result = await this.userModel
      .find()
      .skip(skip)
      .limit(lmt)
      .sort([[orderByColumn, orderBy]])
      .exec();
    const pagination = { count: count, page: pg, limit: lmt };
    const user = [];
    user.push(result);
    user.push(pagination);

    return user;
  }

  /**
   * create User
   */
  async create(createFacilityDto: CreateUserDto) {
    const user = new this.userModel(createFacilityDto);

    return await user.save();
  }

  /**
   * Update a User with userId
   */
  async update(_id: string, updateFacilityDto: UpdateUserDto) {
    const updatedUser = await this.userModel
      .findOneAndUpdate({ userId: _id }, { $set: updateFacilityDto }, { new: true })
      .exec();

    if (!updatedUser) {
      throw new UserNotFountException(_id);
    }

    return updatedUser;
  }

  /**
   * Delete a User with userId
   */
  async delete(_id: string) {
    const user = await this.findOneById(_id);
    const deletedUser = await this.userModel.findOneAndRemove({ user });
    return deletedUser;
  }
}
