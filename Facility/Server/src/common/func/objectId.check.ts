import { HttpException } from "@nestjs/common";
import { Types } from "mongoose";

export function checkObjectIddİsValid(id) {
  const IsValidobject = Types.ObjectId.isValid(id);
  if (!IsValidobject) {
    throw new HttpException(`The param id #${id} is invalid `, 400);
  }
}
