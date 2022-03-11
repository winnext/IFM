import { PaginationParams } from "src/common/commonDto/pagination.dto";
import { BaseInterfaceRepository } from "src/common/repositories/crud.repository.interface";
import { CreateFacilityDto } from "./dtos/create.facility.dto";
import { UpdateFacilityDto } from "./dtos/update.facility.dto";
import { Facility } from "./entities/facility.entity";
export declare class FacilityService {
    private readonly facilityRepository;
    constructor(facilityRepository: BaseInterfaceRepository<Facility>);
    findAll(query: PaginationParams): Promise<Facility[]>;
    findOne(id: string): Promise<Facility>;
    create(createFacilityDto: CreateFacilityDto): Promise<Facility>;
    update(id: string, updateFacilityDto: UpdateFacilityDto): Promise<any>;
    remove(id: string): Promise<Facility>;
    createAll(file: any): Promise<string>;
}
