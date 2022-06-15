import { SchemaFactory } from '@nestjs/mongoose';

import { BaseGraphObject } from 'src/common/baseobject/base.graph.object';

export class FacilityStructure extends BaseGraphObject {
  type: string;
  code: string;
  name: string;
  description: string;
  label: string;
  class_name: string = FacilityStructure.name; // not in dtos
  labelclass: string;
  self_id: number; // not in dtos
  typeId: string;
  realm: string;
  optionalLabels: string[]
}

export const FaciliyStructureSchema = SchemaFactory.createForClass(FacilityStructure);
