import { HttpException } from '@nestjs/common';
export declare class FacilityNotFountException extends HttpException {
    constructor(id: string);
}
export declare class ClassificationNotFountException extends HttpException {
    constructor(id: string);
}
