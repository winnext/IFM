import { SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import * as moment from 'moment';

export class Classification {
  key: string = generateUuid();
  code: string;
  name: string;
  tag: string[] = [];
  label: string;
  createdAt: string = moment().format('YYYY-MM-DD HH:mm:ss');
  updatedAt: string = moment().format('YYYY-MM-DD HH:mm:ss');
  hasParent = true;
  labelclass: string;
  self_id: number;
  selectable: boolean;
  class_name: string = Classification.name; // not in dtos

  isActive: boolean = true;  // not in create dto
  isDeleted: boolean = false; // not in dtos

}

function generateUuid() {
  return uuidv4();
}

export const ClassificationSchema = SchemaFactory.createForClass(Classification); //Silinecek
