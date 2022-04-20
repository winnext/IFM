import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationParams } from 'src/common/commonDto/pagination.dto';
import { RoomNotFountException } from 'src/common/notFoundExceptions/room.not.found.exception';

import { BaseHistoryRepositoryInterface } from 'src/common/repositories/history.repository.interface';
import { CreateRoomHistoryDto } from '../dtos/create.room.history.dto';
import { RoomHistory } from '../entities/user.history.entity';

/**
 * UserHistoryRepository for History Database Reactions
 */
@Injectable()
export class RoomHistoryRepository implements BaseHistoryRepositoryInterface<RoomHistory> {
  constructor(
    @InjectModel(RoomHistory.name)
    private readonly roomHistoryModel: Model<RoomHistory>,
  ) {}

  /**
   * Find one userHistory by mongo Id
   */
  async findOneById(id: string): Promise<RoomHistory[]> {
    const roomHistory = await this.roomHistoryModel.find({ 'user._id': id }).exec();
    if (!roomHistory) {
      throw new RoomNotFountException(id);
    }

    return roomHistory;
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
    const count = parseInt((await this.roomHistoryModel.find().count()).toString());
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
    const result = await this.roomHistoryModel.find().skip(skip).limit(lmt).sort({ 'user.updatedAt': 1 }).exec();
    const pagination = { count: count, page: pg, limit: lmt };
    const room = [];
    room.push(result);
    room.push(pagination);

    return room;
  }
  /**
   * Create user history
   */
  async create(createRoomHistoryDto: CreateRoomHistoryDto) {
    const user = new this.roomHistoryModel(createRoomHistoryDto);

    return await user.save();
  }
}
