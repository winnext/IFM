import { Model } from "mongoose";
import { BaseInterfaceRepository } from "./crud.repository.interface";
export declare abstract class BaseAbstractRepository<T> implements BaseInterfaceRepository<T> {
    private entity;
    protected constructor(entity: Model<T>);
    create(data: T | any): Promise<T>;
    findOneById(id: string): Promise<T>;
    findWithRelations(relations: any): Promise<T[]>;
    findAll(): Promise<T[]>;
    remove(id: string): Promise<T>;
}
