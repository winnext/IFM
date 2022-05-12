import { HttpException, HttpStatus } from '@nestjs/common';
import { Types } from 'mongoose';
import { I18NEnums } from '../const/i18n.enum';

/**
 * Check The Monoose ObjectId is valid or not
 */
export function checkObjectIddİsValid(id) {
  const IsValidobject = Types.ObjectId.isValid(id);
  if (!IsValidobject) {
    throw new HttpException(
      { key: I18NEnums.OBJECTID_NOT_VALID, args: { id: id } },
      HttpStatus.NOT_FOUND,
    );
  }
}
