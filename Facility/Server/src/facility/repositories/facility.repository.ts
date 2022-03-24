import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Classification } from 'src/classification/entities/classification.entity';
import { PaginationParams } from 'src/common/commonDto/pagination.dto';
import { checkObjectIddİsValid } from 'src/common/func/objectId.check';
import { BaseInterfaceRepository } from 'src/common/repositories/crud.repository.interface';
import { FacilityNotFountException } from '../../common/notFoundExceptions/facility.not.found.exception';
import { CreateFacilityDto } from '../dtos/create.facility.dto';
import { UpdateFacilityDto } from '../dtos/update.facility.dto';
import { Facility } from '../entities/facility.entity';
import { Cache } from 'cache-manager';
@Injectable()
export class FacilityRepository implements BaseInterfaceRepository<Facility> {
  constructor(
    @InjectModel(Facility.name) private readonly facilityModel: Model<Facility>,
    @InjectModel(Classification.name) private readonly classificationModel: Model<Classification>,
  //  @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  findWithRelations(relations: any): Promise<Facility[]> {
    throw new Error(relations);
  }
  async findOneById(id: string): Promise<Facility> {
    const facility = await this.facilityModel
      .findById({ _id: id })
      // .populate('classifications', '', this.classificationModel)
      .exec();
    if (!facility) {
      throw new FacilityNotFountException(id);
    }

    return facility;
  }
  async findAll(data: PaginationParams) {
    let { page, limit } = data;
    page = page || 0;
    limit = limit || 5;
    const orderBy = data.orderBy || 'ascending';
    const orderByColumn = data.orderByColumn || 'FacilityName';

    const count = parseInt((await this.facilityModel.find().count()).toString());
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
    const result = await this.facilityModel
      .find()
      .skip(skip)
      .limit(lmt)
      .sort([[orderByColumn, orderBy]])
      .exec();
    const pagination = { count: count, page: pg, limit: lmt };
    const facility = [];
    facility.push(result);
    facility.push(pagination);

    return facility;
  }

  async create(createFacilityDto: CreateFacilityDto) {
    const { classifications } = createFacilityDto;

    checkObjectIddİsValid(classifications.classificationId);

    const facility = new this.facilityModel(createFacilityDto);

    return await facility.save();
  }
  async update(_id: string, updateFacilityDto: UpdateFacilityDto) {
    const { classifications } = updateFacilityDto;

    checkObjectIddİsValid(classifications.classificationId);

    const updatedFacility = await this.facilityModel
      .findOneAndUpdate({ _id }, { $set: updateFacilityDto }, { new: true })
      .exec();

    if (!updatedFacility) {
      throw new FacilityNotFountException(_id);
    }

    return updatedFacility;
  }
  async delete(_id: string) {
    const facility = await this.findOneById(_id);
    return this.facilityModel.remove(facility);
  }
}
