import { BaseGraphObject } from 'src/common/baseobject/base.graph.object';

export class Classification extends BaseGraphObject {
  code: string;
  className: string = Classification.name;
  formtype: string = ""
}
