import { Adress } from "../entities/facility.address";
export declare class CreateFacilityDto {
    facility_name: string;
    locations: string;
    brand_name: string;
    type_of_facility: string;
    classification_of_facility: object;
    label: string[];
    address: Adress;
    updatedAt: Date;
}
