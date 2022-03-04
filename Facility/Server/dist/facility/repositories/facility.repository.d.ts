import { Model } from "mongoose";
import { BaseInterfaceRepository } from "src/common/repositories/crud.repository.interface";
import { CreateFacilityDto } from "../dtos/create.facility.dto";
import { UpdateFacilityDto } from "../dtos/update.facility.dto";
import { Facility } from "../entities/facility.entity";
export declare class FacilityRepository implements BaseInterfaceRepository<Facility> {
    private readonly facilityModel;
    constructor(facilityModel: Model<Facility>);
    findWithRelations(relations: any): Promise<Facility[]>;
    findOneById(id: string): Promise<Facility>;
    findAll(page?: number, limit?: number): Promise<any[]>;
    create(createFacilityDto: CreateFacilityDto): Promise<Facility & {
        _id: any;
    }>;
    update(_id: string, updateFacilityDto: UpdateFacilityDto): Promise<Facility & {
        _id: any;
    }>;
    delete(_id: string): Promise<any>;
}
