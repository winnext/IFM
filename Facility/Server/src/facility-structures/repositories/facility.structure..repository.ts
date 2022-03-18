import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationParams } from 'src/common/commonDto/pagination.dto';
import { checkObjectIddİsValid } from 'src/common/func/objectId.check';
import { BaseInterfaceRepository } from 'src/common/repositories/crud.repository.interface';
import { Facility } from 'src/facility/entities/facility.entity';
import { FacilityNotFountException } from '../../common/notFoundExceptions/facility.not.found.exception';
import { CreateFacilityStructureDto } from '../dto/create-facility-structure.dto';
import { UpdateFacilityStructureDto } from '../dto/update-facility-structure.dto';
import { FacilityStructure } from '../entities/facility-structure.entity';

@Injectable()
export class FacilityStructureRepository implements BaseInterfaceRepository<FacilityStructure> {
  constructor(
    @InjectModel(FacilityStructure.name) private readonly facilityStructureModel: Model<FacilityStructure>,
    @InjectModel(Facility.name) private readonly facilityModel: Model<Facility>,
  ) {}
  findWithRelations(relations: any): Promise<FacilityStructure[]> {
    throw new Error(relations);
  }
  async findOneById(id: string): Promise<FacilityStructure> {
    const facilityStructure = await this.facilityStructureModel
      .findById({ _id: id })
      .populate('facility_id', '', this.facilityModel)
      .exec();
    if (!facilityStructure) {
      throw new FacilityNotFountException(id);
    }

    return facilityStructure;
  }
  async findAll(data: PaginationParams) {
    let { page, limit } = data;
    page = page || 0;
    limit = limit || 5;
    const orderBy = data.orderBy || 'ascending';
    const orderByColumn = data.orderByColumn || 'FacilityName';

    const count = parseInt((await this.facilityStructureModel.find().count()).toString());
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
    const result = await this.facilityStructureModel
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

  async create(createFacilityStructureDto: CreateFacilityStructureDto) {
    const { facility_id } = createFacilityStructureDto;

    checkObjectIddİsValid(facility_id);

    const facilityStructure = new this.facilityStructureModel(createFacilityStructureDto);
    return await facilityStructure.save();
  }
  async update(_id: string, updateFacilityStructureDto: UpdateFacilityStructureDto) {
    const updatedFacilityStructure = await this.facilityStructureModel
      .findOneAndUpdate({ _id }, { $set: updateFacilityStructureDto }, { new: true })
      .exec();

    if (!updatedFacilityStructure) {
      throw new FacilityNotFountException(_id);
    }

    return updatedFacilityStructure;
  }
  async delete(_id: string) {
    const facilityStructure = await this.findOneById(_id);
    return this.facilityStructureModel.remove(facilityStructure);
  }
}
