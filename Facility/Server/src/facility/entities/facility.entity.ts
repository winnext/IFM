import { BaseGraphObject } from 'src/common/baseobject/base.graph.object';

export class Facility extends BaseGraphObject {
  code: string;
  name: string;
  key: string;
  label: string;
  cantDeleted = true;
}
