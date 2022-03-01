/// <reference types="mongoose/types/PipelineStage" />
import { Document } from 'mongoose';
import { BasePersistantDocumentObject } from '../baseObject/base.object';
export declare type FacilityDocument = Facility & Document;
export declare class Facility extends BasePersistantDocumentObject {
    uuid: string;
    facility_name: string;
    locations: string;
    brand_name: string;
    type_of_facility: string;
    classification_of_facility: string;
    label: string[];
    country: string;
    city: string;
    address: string;
}
export declare const FaciliySchema: import("mongoose").Schema<Facility, import("mongoose").Model<Facility, any, any, any>, any, any>;
