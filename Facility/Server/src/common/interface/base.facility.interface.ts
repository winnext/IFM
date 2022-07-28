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

  /**
   * FindOneByRealm method for Repository
   */
  findOneByRealm(realm: string);

  findOneByRealmAndLabel(label: string, realm: string);
}
