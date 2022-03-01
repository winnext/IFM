import { HttpException } from '@nestjs/common';
export declare class FacilityNotFountException extends HttpException {
    constructor(id: string);
}
