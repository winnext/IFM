import { Adress } from '../entities/facility.address';
import { Classification } from 'src/classification/entities/classification.entity';
export declare class CreateFacilityDto {
    facility_name: string;
    locations: string;
    brand_name: string;
    type_of_facility: string;
    classifications: Classification[];
    label: string[];
    address: Adress;
    updatedAt: Date;
}
