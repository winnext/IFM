import { HttpException, HttpStatus } from '@nestjs/common';

export class FacilityNotFountException extends HttpException {
  constructor(id: string) {
    super(`Facility with #${id} Not Found `, HttpStatus.BAD_REQUEST);
  }

  
}

export class ClassificationNotFountException extends HttpException {
  constructor(id: string) {
    super(`Classification with #${id} Not Found `, HttpStatus.BAD_REQUEST);
  }
}