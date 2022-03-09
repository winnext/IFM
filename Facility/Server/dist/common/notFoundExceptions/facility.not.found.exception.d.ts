import { HttpException } from "@nestjs/common";
export declare function FacilityNotFountException(id: any): void;
export declare class ClassificationNotFountException extends HttpException {
    constructor(id: string);
}
