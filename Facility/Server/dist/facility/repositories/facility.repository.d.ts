import { Model } from 'mongoose';
import { Classification } from 'src/classification/entities/classification.entity';
import { PaginationParams } from 'src/common/commonDto/pagination.dto';
import { BaseInterfaceRepository } from 'src/common/repositories/crud.repository.interface';
import { CreateFacilityDto } from '../dtos/create.facility.dto';
import { UpdateFacilityDto } from '../dtos/update.facility.dto';
import { Facility } from '../entities/facility.entity';
export declare class FacilityRepository implements BaseInterfaceRepository<Facility> {
    private readonly facilityModel;
    private readonly classificationModel;
    constructor(facilityModel: Model<Facility>, classificationModel: Model<Classification>);
    findWithRelations(relations: any): Promise<Facility[]>;
    findOneById(id: string): Promise<Facility>;
    findAll(data: PaginationParams): Promise<any[]>;
    create(createFacilityDto: CreateFacilityDto): Promise<Facility & {
        _id: any;
    }>;
    update(_id: string, updateFacilityDto: UpdateFacilityDto): Promise<Facility & {
        _id: any;
    }>;
    delete(_id: string): Promise<any>;
}
