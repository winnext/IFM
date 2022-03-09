import { HttpException, HttpStatus } from "@nestjs/common";

export function FacilityNotFountException(id) {
  throw new HttpException(
    { key: "greet.FACILITY_NOT_FOUND", args: { id: id } },
    HttpStatus.NOT_FOUND
  );
}

export class ClassificationNotFountException extends HttpException {
  constructor(id: string) {
    super(`Classification with #${id} Not Found `, HttpStatus.BAD_REQUEST);
  }
}
