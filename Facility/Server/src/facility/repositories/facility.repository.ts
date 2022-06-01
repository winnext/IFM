/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseInterfaceRepository } from 'ifmcommon';
import { FacilityNotFountException } from '../../common/notFoundExceptions/not.found.exception';
import { CreateFacilityDto } from '../dtos/create.facility.dto';
import { UpdateFacilityDto } from '../dtos/update.facility.dto';
import { Facility } from '../entities/facility.entity';
import { FacilityStructuresService } from 'src/facility-structures/facility-structures.service';
import { CreateFacilityStructureDto } from 'src/facility-structures/dto/create-facility-structure.dto';

@Injectable()
export class FacilityRepository implements BaseInterfaceRepository<Facility> {
  constructor(
    @InjectModel(Facility.name) private readonly facilityModel: Model<Facility>,
    private facilityStructureService: FacilityStructuresService,
  ) {}
  delete(id: string): Promise<Facility> {
    throw new Error('Method not implemented.');
  }
  findAll(data: any): Promise<Facility[]> {
    throw new Error('Method not implemented.');
  }

  async findOneById(realm: string): Promise<Facility> {
    const facility = await this.facilityModel.findOne({ realm }).exec();

    if (!facility) {
      throw new FacilityNotFountException(realm);
    }

    return facility;
  }

  async create(createFacilityDto: CreateFacilityDto) {
    const structure = createFacilityDto.structure as CreateFacilityStructureDto;

    const facility = new this.facilityModel(createFacilityDto);
    await facility.save();
    await this.facilityStructureService.create(structure);
    delete createFacilityDto['structure'];

    return facility;
  }
  async update(_id: string, updateFacilityDto: UpdateFacilityDto) {
    await this.facilityModel.findById(_id);
    const updatedFacility = await this.facilityModel
      .findOneAndUpdate({ _id }, { $set: updateFacilityDto }, { new: true })
      .exec();

    if (!updatedFacility) {
      throw new FacilityNotFountException(_id);
    }

    return updatedFacility;
  }

  async findOne(id: string): Promise<Facility> {
    const facility = await this.facilityModel.findById({ _id: id }).exec();

    if (!facility) {
      throw new FacilityNotFountException(id);
    }

    return facility;
  }
}
