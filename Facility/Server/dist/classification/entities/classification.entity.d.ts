/// <reference types="mongoose/types/PipelineStage" />
/// <reference types="mongoose/types/Error" />
/// <reference types="mongoose/types/Connection" />
/// <reference types="mongoose" />
export declare class Classification {
    key: string;
    code: string;
    name: string;
    tag: string[];
    label: string;
    createdAt: string;
    updatedAt: string;
    hasParent: Boolean;
    labelclass: string;
    self_id: number;
    selectable: boolean;
}
export declare const ClassificationSchema: import("mongoose").Schema<import("mongoose").Document<Classification, any, any>, import("mongoose").Model<import("mongoose").Document<Classification, any, any>, any, any, any>, any, any>;
