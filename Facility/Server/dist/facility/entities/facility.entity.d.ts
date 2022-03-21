/// <reference types="mongoose/types/PipelineStage" />
/// <reference types="mongoose/types/Error" />
/// <reference types="mongoose/types/Connection" />
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Classification } from 'src/classification/entities/classification.entity';
import { BasePersistantDocumentObject } from 'src/common/baseObject/base.object';
import { Adress } from './facility.address';
export declare type FacilityDocument = Facility & Document;
export declare class Facility extends BasePersistantDocumentObject {
    uuid: string;
    facility_name: string;
    locations: string;
    brand_name: string;
    type_of_facility: string;
    classifications: Classification[];
    label: string[];
    pathToChosenNodeClassification: object;
    createdAt: Date;
    updatedAt: Date;
    address: Adress[];
    class_name: string;
}
export declare const FaciliySchema: MongooseSchema<Facility, import("mongoose").Model<Facility, any, any, any>, any, any>;
