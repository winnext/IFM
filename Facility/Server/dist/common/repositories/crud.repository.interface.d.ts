export interface BaseInterfaceRepository<T> {
    update(id: string, data: T | any): any;
    create(data: T | any): Promise<T>;
    findOneById(id: string): Promise<T>;
    findAll(data: T | any): Promise<T[]>;
    delete(id: string): Promise<T>;
    findWithRelations(relations: any): Promise<T[]>;
}
