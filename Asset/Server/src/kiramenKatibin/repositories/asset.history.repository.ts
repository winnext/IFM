import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationParams } from 'src/common/commonDto/pagination.dto';
import { BaseHistoryRepositoryInterface } from 'ifmcommon';
import { AssetHistory } from '../entities/asset.history.entity';
import { CreateAssetHistoryDto } from '../dtos/create.asset.history.dto';

/**
 * UserHistoryRepository for History Database Reactions
 */
@Injectable()
export class AssetHistoryRepository implements BaseHistoryRepositoryInterface<AssetHistory> {
  constructor(
    @InjectModel(AssetHistory.name)
    private readonly assetHistoryModel: Model<AssetHistory>,
  ) {}

  /**
   * Find one userHistory by mongo Id
   */
  async findOneById(id: string): Promise<AssetHistory[]> {
    const assetHistory = await this.assetHistoryModel.find({ 'room._id': id }).exec();
    if (!assetHistory) {
      //  throw new RoomNotFoundException(id);
    }

    return assetHistory;
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
    const count = parseInt((await this.assetHistoryModel.find().count()).toString());
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
    const result = await this.assetHistoryModel.find().skip(skip).limit(lmt).sort({ 'user.updatedAt': 1 }).exec();
    const pagination = { count: count, page: pg, limit: lmt };
    const asset = [];
    asset.push(result);
    asset.push(pagination);

    return asset;
  }
  /**
   * Create user history
   */
  async create(createAssetHistoryDto: CreateAssetHistoryDto) {
    const user = new this.assetHistoryModel(createAssetHistoryDto);

    return await user.save();
  }
}
