import { Adress } from '../entities/facility.address';
import { ClassificationDetail } from '../entities/classification.detail';
export declare class CreateFacilityDto {
    facility_name: string;
    locations: string;
    brand_name: string;
    type_of_facility: string;
    classifications: ClassificationDetail;
    label: string[];
    address: Adress;
    updatedAt: Date;
}
