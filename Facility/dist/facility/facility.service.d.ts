import { Model } from 'mongoose';
import { CreateFacilityDto } from './dtos/create.facility.dto';
import { Facility } from './entities/facility.entity';
import { FacilityRepository } from './repositories/facility.repository';
export declare class FacilityService {
    private readonly facilityRepository;
    private readonly facilityModel;
    constructor(facilityRepository: FacilityRepository, facilityModel: Model<Facility>);
    findAll(): Promise<Facility[]>;
    findOne(_id: string): Promise<Facility>;
    create(createFacilityDto: CreateFacilityDto): Promise<Facility>;
    remove(id: string): Promise<Facility>;
}
