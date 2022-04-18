import { HttpException, HttpStatus } from '@nestjs/common';
import { I18NEnums } from '../const/i18n.enum';

/**
 * Throw User Not Found Exception
 */
export function UserNotFountException(id) {
  throw new HttpException({ key: I18NEnums.USER_NOT_FOUND, args: { id: id } }, HttpStatus.NOT_FOUND);
}
