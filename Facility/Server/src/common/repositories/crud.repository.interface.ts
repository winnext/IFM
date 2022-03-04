export interface BaseInterfaceRepository<T> {
  update(id: string, data: T | any);

  create(data: T | any): Promise<T>;

  findOneById(id: string): Promise<T>;

  //findByCondition(filterCondition: any): Promise<T>;

  findAll(skip, limit): Promise<T[]>;

  delete(id: string): Promise<T>;

  findWithRelations(relations: any): Promise<T[]>;
}