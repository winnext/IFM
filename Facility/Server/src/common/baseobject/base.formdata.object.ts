import * as moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

export class BaseFormdataObject {
  key: string = generateUuid();
  createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
  updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
  isActive = true;
  isDeleted = false;
  canDelete = true;
}

function generateUuid() {
  return uuidv4();
}