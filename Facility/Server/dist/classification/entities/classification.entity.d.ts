/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/connection" />
import { Document } from "mongoose";
export declare type ClassificationDocument = Classification & Document;
export declare class Classification extends Document {
    uuid: string;
    code: string;
    name: string;
}
export declare const ClassificationSchema: import("mongoose").Schema<Classification, import("mongoose").Model<Classification, any, any, any>, any, any>;
