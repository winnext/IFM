/// <reference types="mongoose/types/PipelineStage" />
/// <reference types="mongoose/types/Error" />
/// <reference types="mongoose/types/Connection" />
import { Document } from 'mongoose';
export declare type ClassificationDocument = Classification & Document;
export declare class Classification extends Document {
    uuid: string;
    code: string;
    name: string;
    class_name: string;
    detail: object;
}
export declare const ClassificationSchema: import("mongoose").Schema<Classification, import("mongoose").Model<Classification, any, any, any>, any, any>;
