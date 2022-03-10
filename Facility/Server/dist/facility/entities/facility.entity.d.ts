/// <reference types="mongoose/types/PipelineStage" />
/// <reference types="mongoose/types/Error" />
/// <reference types="mongoose/types/Connection" />
import { Timestamp } from "bson";
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
    createdAt: Timestamp;
    updatedAt: Timestamp;
    city: string;
    address: string;
    class_name: string;
}
export declare const FaciliySchema: import("mongoose").Schema<Facility, import("mongoose").Model<Facility, any, any, any>, any, any>;
