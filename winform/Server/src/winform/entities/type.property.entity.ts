import {SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import * as moment from 'moment'
import { string } from 'joi';
export class TypeProperty {

  key:string = generateUuid();
  type:string;
  typeId:string;
  label:string;
  defaultValue:string;
  rules: string[] = [];
  tag: string[] = [];
  labelclass: string;
  createdAt: string = moment().format('YYYY-MM-DD HH:mm:ss'); // not in dtos
  updatedAt: string = moment().format('YYYY-MM-DD HH:mm:ss'); // not in dtos
  isActive: boolean = true;  // not in create dto
  isDeleted: boolean = false; // not in dtos


}
function generateUuid() {
  return uuidv4()
}

