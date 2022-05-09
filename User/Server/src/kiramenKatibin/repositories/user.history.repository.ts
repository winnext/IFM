import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationParams } from 'src/common/commonDto/pagination.dto';
import { UserNotFountException } from 'src/common/notFoundExceptions/user.not.found.exception';

import { BaseHistoryRepositoryInterface } from 'ifmcommon';
import { CreateUserHistoryDto } from '../dtos/create.user.history.dto';
import { UserHistory } from '../entities/user.history.entity';

/**
 * UserHistoryRepository for History Database Reactions
 */
@Injectable()
export class UserHistoryRepository implements BaseHistoryRepositoryInterface<UserHistory> {
  /**
   * User Model for Database Reactions
   */
  constructor(
    @InjectModel(UserHistory.name)
    private readonly userHistoryModel: Model<UserHistory>,
  ) {}

  /**
   * Find one userHistory by mongo Id
   */
  async findOneById(id: string): Promise<UserHistory[]> {
    const userHistory = await this.userHistoryModel.find({ 'user._id': id }).exec();
    if (!userHistory) {
      throw new UserNotFountException(id);
    }

    return userHistory;
  }

  /**
   * Find all user histories
   */
  async findAll(data: PaginationParams) {
    let { page, limit } = data;
    page = page || 0;
    limit = limit || 5;
    //orderBy = orderBy || 'ascending';

    // orderByColumn = orderByColumn || '';
    const count = parseInt((await this.userHistoryModel.find().count()).toString());
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
    const result = await this.userHistoryModel.find().skip(skip).limit(lmt).sort({ 'user.updatedAt': 1 }).exec();
    const pagination = { count: count, page: pg, limit: lmt };
    const user = [];
    user.push(result);
    user.push(pagination);

    return user;
  }
  /**
   * Create user history
   */
  async create(createFacilityHistoryDto: CreateUserHistoryDto) {
    const user = new this.userHistoryModel(createFacilityHistoryDto);

    return await user.save();
  }
}
