import { Model } from 'mongoose';
import { BaseInterfaceRepository } from 'src/common/repositories/crud.repository.interface';
import { CreateFacilityDto } from '../dtos/create.facility.dto';
import { Facility } from '../entities/facility.entity';
export declare class FacilityRepository implements BaseInterfaceRepository<Facility> {
    private readonly facilityModel;
    constructor(facilityModel: Model<Facility>);
    remove(id: string): Promise<Facility>;
    findWithRelations(relations: any): Promise<Facility[]>;
    findOneById(_id: string): Promise<Facility>;
    findAll(): Promise<(Facility & {
        _id: any;
    })[]>;
    create(createFacilityDto: CreateFacilityDto): Promise<Facility & {
        _id: any;
    }>;
    update(): void;
    delete(): void;
}
