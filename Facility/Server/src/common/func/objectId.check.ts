import { HttpException, HttpStatus } from "@nestjs/common";
import { Types } from "mongoose";

export function checkObjectIddİsValid(id) {
  const IsValidobject = Types.ObjectId.isValid(id);
  if (!IsValidobject) {
    throw new HttpException(
      { key: 'greet.FACILITY_NOT_FOUND', args: { id:id } },
    HttpStatus.NOT_FOUND,
       );
  }
}
