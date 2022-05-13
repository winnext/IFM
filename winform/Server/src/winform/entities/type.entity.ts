import {SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import * as moment from 'moment'
export class Type {

  key:string = generateUuid();
  code:string;
  name:string;
  tag: string[] = [];
  label: string;  // not in dtos
  createdAt: string = moment().format('YYYY-MM-DD HH:mm:ss'); // not in dtos
  updatedAt: string = moment().format('YYYY-MM-DD HH:mm:ss'); // not in dtos
  isActive: boolean = true;  // not in create dto
  isDeleted: boolean = false; // not in dtos


  hasParent: Boolean = true;  // not in dtos
  labelclass: string;
  hasType : boolean = false;  // not in dtos

  
  
}
function generateUuid() {
  return uuidv4()
}
