import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationParams } from 'src/common/commonDto/pagination.dto';

import { BaseInterfaceRepository } from 'ifmcommon';

import { Asset } from '../entities/room.entity';
import { CreateAssetDto } from '../dto/create.asset.dto';
import { UpdateAssetDto } from '../dto/update.room.dto';

/**
 * Room Repository For Database Reactions
 */
@Injectable()
export class RoomRepository implements BaseInterfaceRepository<Asset> {
  /**
   * Inject Mongoose Room Model
   */
  constructor(@InjectModel(Asset.name) private readonly roomModel: Model<Asset>) {}

  /**
   * Find one Room by id
   */
  async findOneById(_id: string): Promise<Asset> {
    const room = await this.roomModel.findOne({ _id }).exec();
    if (!room) {
      // throw new RoomNotFoundException(_id);
    }

    return room;
  }

  /**
   * Find All Rooms with Pagination
   */
  async findAll(data: PaginationParams) {
    let { page, limit } = data;
    page = page || 0;
    limit = limit || 5;
    const orderBy = data.orderBy || 'ascending';
    const orderByColumn = data.orderByColumn || 'createdAt';

    const count = parseInt((await this.roomModel.find().count()).toString());
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
    const result = await this.roomModel
      .find()
      .skip(skip)
      .limit(lmt)
      .sort([[orderByColumn, orderBy]])
      .exec();
    const pagination = { count: count, page: pg, limit: lmt };
    const room = [];
    room.push(result);
    room.push(pagination);

    return room;
  }

  /**
   * create Room
   */
  async create(createRoomDto: CreateAssetDto) {
    const room = new this.roomModel(createRoomDto);

    return await room.save();
  }

  /**
   * Update a Room with id
   */
  async update(_id: string, updateRoomDto: UpdateAssetDto) {
    const updatedRoom = await this.roomModel.findOneAndUpdate({ _id }, { $set: updateRoomDto }, { new: true }).exec();

    if (!updatedRoom) {
      // throw new RoomNotFoundException(_id);
    }

    return updatedRoom;
  }

  /**
   * Delete a Room with id
   */
  async delete(_id: string) {
    const room = await this.findOneById(_id);
    const deletedRoom = await this.roomModel.findOneAndRemove({ room });
    return deletedRoom;
  }
}
