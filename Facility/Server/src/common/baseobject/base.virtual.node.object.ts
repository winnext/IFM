import * as moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

export abstract class BaseOfVirtualNode {
  key: string = generateUuid();
  createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
  updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
  canDelete = true;
  isDeleted = false;
}

export function generateUuid() {
  return uuidv4();
}
