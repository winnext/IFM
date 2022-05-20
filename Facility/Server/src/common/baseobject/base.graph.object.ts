import * as moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

export abstract class BaseGraphObject {
  key: string = generateUuid();
  createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
  updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
  isActive = true;
  isDeleted = false;
  hasParent = true; // not in dtos
  tag: string[] = [];
  selectable = true; // not in dtos
}

function generateUuid() {
  return uuidv4();
}
