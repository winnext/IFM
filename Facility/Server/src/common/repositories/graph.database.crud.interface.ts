export interface BaseGraphDatabaseInterfaceRepository<T> {
  update(id: string, data: T | any);

  create(data: T | any): Promise<T>;

  findOneById(id: string);

  //findByCondition(filterCondition: any): Promise<T>;

  findAll(data: T | any): Promise<T[]>;

  delete(id: string);

  changeNodeBranch(id: string, target_parent_id: string);

  findOneNodeByKey(key: string);
}
