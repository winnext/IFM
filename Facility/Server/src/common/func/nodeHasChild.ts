import { HttpException, HttpStatus } from '@nestjs/common';
import { I18NEnums } from '../const/i18n.enum';

export function nodeHasChild(name) {
  throw new HttpException({ key: I18NEnums.NODE_HAS_CHILD, args: { name: name } }, HttpStatus.NOT_FOUND);
}
