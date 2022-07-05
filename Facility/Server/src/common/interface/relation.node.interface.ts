export interface VirtualNodeInterface<T> {
  create(id: string, data: T | any): any;
  findOneById(id: string): any;
  delete(id: string): any;

  findOneNodeByKey(key: string): any;
}
