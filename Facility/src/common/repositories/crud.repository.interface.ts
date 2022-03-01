import { Facility } from 'src/facility/entities/facility.entity';

export interface BaseInterfaceRepository<T> {
  create(data: T | any): Promise<T>;

  findOneById(id: string): Promise<T>;

  //findByCondition(filterCondition: any): Promise<T>;

  findAll(): Promise<T[]>;

  remove(id: string): Promise<T>;

  findWithRelations(relations: any): Promise<T[]>;
}
