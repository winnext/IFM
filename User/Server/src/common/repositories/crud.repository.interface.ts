/**
 * Crud Interface for Endpoints
 */
export interface BaseInterfaceRepository<T> {
  /**
   * Update method for Repository
   */
  update(id: string, data: T | any);

  /**
   * Create method  for Repository
   */
  create(data: T | any): Promise<T>;

  /**
   * FindOneById method for Repository
   */
  findOneById(id: string);

  //findByCondition(filterCondition: any): Promise<T>;

  /**
   * FindAll method for Repository
   */
  findAll(data: T | any): Promise<T[]>;

  /**
   * Delete method for Repository
   */
  delete(id: string): Promise<T>;
}
