import {SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import * as moment from 'moment'
import { string } from 'joi';


export class FacilityStructure {

  key:string = generateUuid(); // not in dtos
  type:string;
  code:string;
  name:string;
  description: string;
  tag: string[] = [];
  label: string;  // not in dtos
  createdAt: string = moment().format('YYYY-MM-DD HH:mm:ss'); // not in dtos
  updatedAt: string = moment().format('YYYY-MM-DD HH:mm:ss'); // not in dtos
  facility_id: string;
  isActive: boolean = true;  // not in create dto
  isDeleted: boolean = false; // not in create dto
  class_name: string = FacilityStructure.name; // not in dtos

  hasParent: Boolean = true;  // not in dtos
  labelclass: string;
  self_id: number;     // not in dtos
  selectable: boolean; // not in dtos
}
function generateUuid() {
  return uuidv4()
}
export const FaciliyStructureSchema = SchemaFactory.createForClass(FacilityStructure);
