import { HttpException, HttpStatus } from '@nestjs/common';
import { I18NEnums } from '../const/i18n.enum';

/**
 * Throw User Not Found Exception
 */
export function RoomNotFountException(id) {
  throw new HttpException({ key: I18NEnums.ROOM_NOT_FOUND, args: { id: id } }, HttpStatus.NOT_FOUND);
}
