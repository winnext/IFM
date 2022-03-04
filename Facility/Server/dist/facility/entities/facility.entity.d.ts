/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/connection" />
import { Document } from "mongoose";
import { BasePersistantDocumentObject } from "src/common/baseObject/base.object";
export declare type FacilityDocument = Facility & Document;
export declare class Facility extends BasePersistantDocumentObject {
    uuid: string;
    facility_name: string;
    locations: string;
    brand_name: string;
    type_of_facility: string;
    classification_of_facility: object[];
    label: string[];
    country: string;
    city: string;
    address: string;
}
export declare const FaciliySchema: import("mongoose").Schema<Facility, import("mongoose").Model<Facility, any, any, any>, any, any>;
