export interface VirtualNodeInterface<T> {
  update(id: string, data: T | any): any;
  create(id: string, data: T | any): any;
  findOneById(id: string): any;
  delete(id: string): any;
  changeNodeBranch(id: string, target_parent_id: string): any;
  findOneNodeByKey(key: string): any;
}
