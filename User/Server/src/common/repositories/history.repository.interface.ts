/**
 * For History Repository To Save History
 */
export interface BaseHistoryRepositoryInterface<T> {
  /**
   * Create method  for HistoryRepository
   */
  create(data: T | any): Promise<T>;

  /**
   * FindOneById method  for HistoryRepository
   */
  findOneById(id: string);

  /**
   * FindAll method  for HistoryRepository
   */
  findAll(data: T | any): Promise<T[]>;
}
