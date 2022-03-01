import { CreateFacilityDto } from './dtos/create.facility.dto';
import { UpdateFacilityDto } from './dtos/update.facility.dto';
import { Facility } from './entities/facility.entity';
import { FacilityService } from './facility.service';
export declare class FacilityController {
    private readonly facilityService;
    constructor(facilityService: FacilityService);
    getAllFacilities(): Promise<Facility[]>;
    getFacility(id: string): Promise<Facility>;
    createFacility(createFacilityDto: CreateFacilityDto): Promise<Facility>;
    updateFacility(id: string, updateFacilityDto: UpdateFacilityDto): void;
    deleteFacility(id: string): Promise<Facility>;
}
