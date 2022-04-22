/* eslint-disable @typescript-eslint/no-unused-vars */
import { NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { BaseInterfaceRepository } from './crud.repository.interface';

export abstract class BaseAbstractRepository<T> implements BaseInterfaceRepository<T> {
  private entity: Model<T>;

  protected constructor(entity: Model<T>) {
    this.entity = entity;
  }
  update(_id: string, data: any) {
    throw new Error('Method not implemented.');
  }
  delete(_id: string): Promise<T> {
    throw new Error('Method not implemented.');
  }

  public async create(data: T | any): Promise<T> {
    return await this.entity.create(data);
  }

  public async findOneById(id: string): Promise<T> {
    const test = await this.entity.findOne({ _id: id });
    if (!test) {
      throw new NotFoundException('Not found');
    }
    return await this.entity.findOne({ _id: id });
  }

  /*
    public async findByCondition(filterCondition: any): Promise<T> {
      return await this.entity.findOne({where: filterCondition});
    }
  */
  public async findWithRelations(relations: any): Promise<T[]> {
    return await this.entity.find(relations);
  }

  public async findAll(): Promise<T[]> {
    return await this.entity.find();
  }

  public async remove(id: string): Promise<T> {
    return await this.entity.findByIdAndDelete(id);
  }

}
