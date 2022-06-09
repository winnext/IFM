import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationParams } from 'src/common/commonDto/pagination.dto';
import { BaseHistoryRepositoryInterface } from 'ifmcommon';
import { TreeHistory } from '../entities/tree.history.entity';
import { CreateTreeHistoryDto } from '../dtos/create.tree.history.dto';

@Injectable()
export class TreeHistoryRepository implements BaseHistoryRepositoryInterface<TreeHistory> {
  constructor(
    @InjectModel(TreeHistory.name)
    private readonly treeHistoryModel: Model<TreeHistory>,
  ) {}

  async findOneById(id: string): Promise<TreeHistory[]> {
    const page = 0;
    const limit = 100;
    //orderBy = orderBy || 'ascending';

    // orderByColumn = orderByColumn || '';
    const count = parseInt((await this.treeHistoryModel.find({ 'tree.properties.labelclass': id }).count()).toString());
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
    const result = await this.treeHistoryModel
      .find({ 'tree.properties.labelclass': id })
      .skip(skip)
      .limit(lmt)
      .sort({ 'tree.updatedAt': 1 })
      .exec();
    const pagination = { count: count, page: pg, limit: lmt };
    const tree = [];
    tree.push(result);
    tree.push(pagination);

    return tree;
  }
  async findAll(data: PaginationParams) {
    let { page, limit } = data;
    page = page || 0;
    limit = limit || 5;
    //orderBy = orderBy || 'ascending';

    // orderByColumn = orderByColumn || '';
    const count = parseInt((await this.treeHistoryModel.find().count()).toString());
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
    const result = await this.treeHistoryModel.find().skip(skip).limit(lmt).sort({ 'tree.updatedAt': 1 }).exec();
    const pagination = { count: count, page: pg, limit: lmt };
    const tree = [];
    tree.push(result);
    tree.push(pagination);

    return tree;
  }

  async create(createTreeDto: CreateTreeHistoryDto) {
    const tree = new this.treeHistoryModel(createTreeDto);

    return await tree.save();
  }
}
