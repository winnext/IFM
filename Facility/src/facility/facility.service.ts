import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FacilityNotFountException } from './commonExceptions/facility.not.found.exception';
import { CreateFacilityDto } from './dtos/create.facility.dto';
import { Facility } from './entities/facility.entity';
import { FacilityRepository } from './repositories/facility.repository';

@Injectable()
export class FacilityService {
  constructor(
    @Inject('FacilityRepositoryInterface')
    private readonly facilityRepository: FacilityRepository,
    @InjectModel(Facility.name) private readonly facilityModel: Model<Facility>,
  ) {}

  findAll(): Promise<Facility[]> {
    return this.facilityRepository.findAll();
  }

  async findOne(_id: string): Promise<Facility> {
    return this.facilityRepository.findOneById(_id)
     //const facility = await this.facilityModel.findById({ _id }).exec();
     //if (!facility) {
     //  throw new FacilityNotFountException(_id);
     //}
     //return facility;
  }

  create(createFacilityDto: CreateFacilityDto): Promise<Facility> {
    return this.facilityRepository.create(createFacilityDto);
  }

  // async update(id: string, updateFacilityDto: UpdateFacilityDto) {
  //   const updatedFacility = await this.facilityModel
  //     .findOneAndUpdate({ _id: id }, { $set: updateFacilityDto }, { new: true })
  //     .exec();

  //   if (!updatedFacility) {
  //     throw new NotFoundException(`Facility #${id} not found`);
  //   }

  //   return updatedFacility;
  // }

  async remove(id: string) {
    const facility = await this.findOne(id);
    return facility.remove();
  }
}
