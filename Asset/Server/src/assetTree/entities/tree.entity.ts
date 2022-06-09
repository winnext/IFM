import { BaseGraphObject } from 'src/common/baseobject/base.graph.object';

export class Tree extends BaseGraphObject {
  code: string;
  name: string;
  label: string;
  labelclass: string;
  self_id: number;
  class_name: string = Tree.name; // not in dtos
}
