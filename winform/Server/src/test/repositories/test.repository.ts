import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Test } from '../entities/test.entity';
import { CreateTestDto } from '../dto/create.test.dto';

import { BaseInterfaceRepository } from '../../common/repositories/crud.repository.interface';

@Injectable()
export class TestRepository implements BaseInterfaceRepository<Test> {
  constructor(@InjectModel(Test.name) private readonly testModel: Model<Test>) {}

  findWithRelations(relations: any): Promise<Test[]> {
    throw new Error(relations);
  }
  async findOneById(id: string): Promise<Test> {
    const test = await this.testModel.findById({ _id: id }).exec();

    return test;
  }
  async findAll() {
    const result = await this.testModel.find().exec();

    const test = [];
    test.push(result);

    return test;
  }

  async create(createTestDto: CreateTestDto) {
    const test = new this.testModel({ ...createTestDto, items: [] });
    console.log(createTestDto);
    console.log(test);

    return await test.save();
  }
  async update(_id: string, updateTestDto: any) {
    const updatedTest = await this.testModel.findOneAndUpdate({ _id }, { $set: updateTestDto }, { new: true }).exec();

    return updatedTest;
  }
  async delete(_id: string) {
    const test = await this.findOneById(_id);
    return this.testModel.remove(test);
  }
}
