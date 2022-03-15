import { HttpException, HttpStatus } from "@nestjs/common";
import { I18NEnums } from "../const/i18n.enum";

export function FacilityNotFountException(id) {
  throw new HttpException(
    { key: I18NEnums.FACILITY_NOT_FOUND, args: { id: id } },
    HttpStatus.NOT_FOUND
  );
}

export function ClassificationNotFountException(id) {
  throw new HttpException(
    { key: I18NEnums.CLASSIFICATION_NOT_FOUND, args: { id: id } },
    HttpStatus.NOT_FOUND
  );
}
