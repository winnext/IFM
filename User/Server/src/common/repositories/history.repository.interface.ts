export interface BaseHistoryRepositoryInterface<T> {
  create(data: T | any): Promise<T>;

  findOneById(id: string);

  findAll(data: T | any): Promise<T[]>;
}
