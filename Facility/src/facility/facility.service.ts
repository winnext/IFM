import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FacilityNotFountException } from './commonExceptions/facility.not.found.exception';
import { CreateFacilityDto } from './dtos/create.facility.dto';
import { UpdateFacilityDto } from './dtos/update.facility.dto';
import { Facility } from './entities/facility.entity';

@Injectable()
export class FacilityService {
  constructor(
    @InjectModel(Facility.name) private readonly facilityModel: Model<Facility>,
  ) {}

  async findAll() {
    return await this.facilityModel.find().exec();
  }

  async findOne(id: string) {
    const facility = await this.facilityModel.findById({ _id: id }).exec();
    if (!facility) {
      throw new FacilityNotFountException(id)
    }
    
    return facility;
  }

  create(createFacilityDto: CreateFacilityDto) {
    const facility = new this.facilityModel(createFacilityDto);

    return facility.save();
  }

  async update(id: string, updateFacilityDto: UpdateFacilityDto) {
    const updatedFacility = await this.facilityModel
      .findOneAndUpdate({ _id: id }, { $set: updateFacilityDto }, { new: true })
      .exec();

    if (!updatedFacility) {
      throw new NotFoundException(`Facility #${id} not found`);
    }

    return updatedFacility;
  }

  async remove(id: string) {
    const facility = await this.findOne(id);
    return facility.remove();
  }
}
