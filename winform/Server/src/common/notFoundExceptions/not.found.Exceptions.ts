import { HttpException, HttpStatus } from '@nestjs/common';
import { I18NEnums } from '../const/i18n.enum';

export function TypeNotFountException(label) {
  throw new HttpException({ key: I18NEnums.TYPE_NOT_FOUND, args: { label: label } }, HttpStatus.NOT_FOUND);
}