export interface BaseInterfaceRepository<T> {
    update(id: string, data: T | any): any;
    create(data: T | any): Promise<T>;
    findOneById(id: string): any;
    findAll(data: T | any): Promise<T[]>;
    delete(id: string): Promise<T>;
}
