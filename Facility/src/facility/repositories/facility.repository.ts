import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseInterfaceRepository } from "src/common/repositories/crud.repository.interface";
import { FacilityNotFountException } from "../commonExceptions/facility.not.found.exception";
import { CreateFacilityDto } from "../dtos/create.facility.dto";
import { UpdateFacilityDto } from "../dtos/update.facility.dto";
import { Facility } from "../entities/facility.entity";

@Injectable()
export class FacilityRepository implements BaseInterfaceRepository<Facility> {
  constructor(
    @InjectModel(Facility.name) private readonly facilityModel: Model<Facility>
  ) {}

  remove(id: string): Promise<Facility> {
    throw new Error("Method not implemented.");
  }
  findWithRelations(relations: any): Promise<Facility[]> {
    throw new Error("Method not implemented.");
  }
  async findOneById(_id: string): Promise<Facility> {
    const facility = await this.facilityModel.findById({ _id }).exec();
    if (!facility) {
      throw new FacilityNotFountException(_id);
    }
    return facility;
  }
  async findAll() {
    return await this.facilityModel.find().exec();
  }
  async create(createFacilityDto: CreateFacilityDto) {
    const facility = new this.facilityModel(createFacilityDto);

    return await facility.save();
  }
  async update(_id:string,updateFacilityDto:UpdateFacilityDto) {
    const updatedFacility = await this.facilityModel
    .findOneAndUpdate({ _id}, { $set: updateFacilityDto }, { new: true })
    .exec();

   if (!updatedFacility) {
     throw new FacilityNotFountException(_id)
   }

   return updatedFacility;
  }
  delete() {
    throw new Error("Method not implemented.");
  }
}
