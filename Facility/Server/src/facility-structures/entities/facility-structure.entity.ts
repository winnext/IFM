import { SchemaFactory } from '@nestjs/mongoose';

import { BaseGraphObject } from 'src/common/baseobject/base.graph.object';

export class FacilityStructure extends BaseGraphObject {
  type: string;
  code: string;
  name: string;
  description: string;
  label: string; // not in dtos
  class_name: string = FacilityStructure.name; // not in dtos
  labelclass: string;
  self_id: number; // not in dtos
  typeId: string;
}

export const FaciliyStructureSchema = SchemaFactory.createForClass(FacilityStructure);
