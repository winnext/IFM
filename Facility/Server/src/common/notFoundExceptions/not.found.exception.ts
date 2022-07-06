import { HttpException, HttpStatus } from '@nestjs/common';
import { I18NEnums } from '../const/i18n.enum';

export function FacilityNotFountException(id) {
  throw new HttpException({ key: I18NEnums.FACILITY_NOT_FOUND, args: { id: id } }, HttpStatus.NOT_FOUND);
}

export function FacilityStructureNotFountException(id) {
  throw new HttpException({ key: I18NEnums.FACILITY_NOT_FOUND, args: { id: id } }, HttpStatus.NOT_FOUND);
}

export function ClassificationNotFountException(id) {
  throw new HttpException({ key: I18NEnums.CLASSIFICATION_NOT_FOUND, args: { id: id } }, HttpStatus.NOT_FOUND);
}
/**
 * Throw Room Not Found Exception
 */
export function RoomNotFoundException(id) {
  throw new HttpException({ key: I18NEnums.ROOM_NOT_FOUND, args: { id: id } }, HttpStatus.NOT_FOUND);
}

export function RelationNotFountException(id) {
  throw new HttpException({ key: I18NEnums.RELATION_NOT_FOUND, args: { id: id } }, HttpStatus.NOT_FOUND);
}
export function ContactNotFoundException(id) {
  throw new HttpException({ key: I18NEnums.CONTACT_NOT_FOUND, args: { id: id } }, HttpStatus.NOT_FOUND);
}
