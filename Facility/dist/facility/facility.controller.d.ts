import { CreateFacilityDto } from "./dtos/create.facility.dto";
import { UpdateFacilityDto } from "./dtos/update.facility.dto";
import { Facility } from "./entities/facility.entity";
import { FacilityService } from "./facility.service";
import { PaginationParams } from "src/common/commonDto/pagination.dto";
export declare class FacilityController {
    private readonly facilityService;
    constructor(facilityService: FacilityService);
    getAllFacilities(query: PaginationParams): Promise<Facility[]>;
    getFacility(id: string): Promise<Facility>;
    createFacility(createFacilityDto: CreateFacilityDto): Promise<Facility>;
    updateFacility(id: string, updateFacilityDto: UpdateFacilityDto): Promise<any>;
    deleteFacility(id: string): Promise<Facility>;
}
