/// <reference types="mongoose/types/PipelineStage" />
/// <reference types="mongoose/types/Error" />
/// <reference types="mongoose/types/Connection" />
/// <reference types="mongoose" />
export declare class Classification {
    key: string;
    code: string;
    name: string;
    label: string[];
    createdAt: Date;
    updatedAt: Date;
    hasParent: Boolean;
}
export declare const ClassificationSchema: import("mongoose").Schema<import("mongoose").Document<Classification, any, any>, import("mongoose").Model<import("mongoose").Document<Classification, any, any>, any, any, any>, any, any>;
