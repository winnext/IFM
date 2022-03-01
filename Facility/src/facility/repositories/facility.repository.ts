import { Injectable, UseInterceptors } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { BaseInterfaceRepository } from "src/common/repositories/crud.repository.interface";
import { FacilityNotFountException } from "../../common/notFoundExceptions/facility.not.found.exception";
import { CreateFacilityDto } from "../dtos/create.facility.dto";
import { UpdateFacilityDto } from "../dtos/update.facility.dto";
import { Facility } from "../entities/facility.entity";

@Injectable()
export class FacilityRepository implements BaseInterfaceRepository<Facility> {
  constructor(
    @InjectModel(Facility.name) private readonly facilityModel: Model<Facility>
  ) {}
  findWithRelations(relations: any): Promise<Facility[]> {
    throw new Error("Method not implemented.");
  }
  async findOneById(id: string): Promise<Facility> {
    const facility = await this.facilityModel.findById({ _id: id }).exec();
    if (!facility) {
      throw new FacilityNotFountException(id);
    }

    return facility;
  }
  async findAll(skip=0,limit=5) {
    
    return await this.facilityModel.find().skip(skip).limit(limit).exec();
  }
  async create(createFacilityDto: CreateFacilityDto) {
    const facility = new this.facilityModel(createFacilityDto);

    return await facility.save();
  }
  async update(_id: string, updateFacilityDto: UpdateFacilityDto) {
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
