export interface VirtualNodeInterface<T> {
  create(key: string, data: T | any): any;
  delete(key: string): any;
  findOneNodeByKey(key: string): any;
}
