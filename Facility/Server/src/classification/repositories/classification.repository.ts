import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationParams } from 'src/common/commonDto/pagination.dto';
import { ClassificationNotFountException } from 'src/common/notFoundExceptions/not.found.exception';
import { BaseInterfaceRepository } from 'src/common/repositories/crud.repository.interface';
import { CreateClassificationDto } from '../dto/create-classification.dto';
import { UpdateClassificationDto } from '../dto/update-classification.dto';

import { Classification } from '../entities/classification.entity';

@Injectable()
export class ClassificationRepository implements BaseInterfaceRepository<Classification> {
  constructor(
    @InjectModel(Classification.name)
    private readonly classificationModel: Model<Classification>,
  ) {}
  findWithRelations(relations: any): Promise<Classification[]> {
    throw new Error(relations);
  }
  async findOneById(id: string): Promise<Classification> {
    const classification = await this.classificationModel.findById({ _id: id }).exec();
    if (!classification) {
      throw new ClassificationNotFountException(id);
    }

    return classification;
  }
  async findAll(data: PaginationParams) {
    let { page, limit, orderBy, orderByColumn } = data;
    page = page || 0;
    limit = limit || 5;
    orderBy = orderBy || 'ascending';

    orderByColumn = orderByColumn || 'name';
    const count = parseInt((await this.classificationModel.find().count()).toString());
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
    const result = await this.classificationModel
      .find()
      .skip(skip)
      .limit(lmt)
      .sort([[orderByColumn, orderBy]])
      .exec();
    const pagination = { count: count, page: pg, limit: lmt };
    const classification = [];
    classification.push(result);
    classification.push(pagination);

    return classification;
  }

  async create(createClassificationDto: CreateClassificationDto) {
    const classification = new this.classificationModel(createClassificationDto);

    return await classification.save();
  }
  async update(_id: string, updateClassificationto: UpdateClassificationDto) {
    const updatedFacility = await this.classificationModel
      .findOneAndUpdate({ _id }, { $set: updateClassificationto }, { new: true })
      .exec();

    if (!updatedFacility) {
      throw new ClassificationNotFountException(_id);
    }

    return updatedFacility;
  }
  async delete(_id: string) {
    const classification = await this.findOneById(_id);
    return this.classificationModel.remove(classification);
  }
}
