import { BaseGraphObject } from 'src/common/baseobject/base.graph.object';

export class Facility extends BaseGraphObject {
  name: string;
  realm: string;
  canDelete = false;
}
