import { HttpException, HttpStatus } from '@nestjs/common';
import { I18NEnums } from '../const/i18n.enum';

export function AssetNotFountException(id) {
  throw new HttpException({ key: I18NEnums.ASSET_NOT_FOUND, args: { id: id } }, HttpStatus.NOT_FOUND);
}

export function ClassificationNotFountException(id) {
  throw new HttpException({ key: I18NEnums.TREE_NOT_FOUND, args: { id: id } }, HttpStatus.NOT_FOUND);
}
