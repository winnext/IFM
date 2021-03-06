import { BaseGraphObject } from 'src/common/baseobject/base.graph.object';

export class Classification extends BaseGraphObject {
  code: string;
  name: string;
  label: string;
  labelclass: string;
  self_id: number;
  class_name: string = Classification.name; // not in dtos
  optionalLabels: string[]
}
