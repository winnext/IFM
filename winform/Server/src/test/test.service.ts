import { Inject, Injectable } from '@nestjs/common';
import { BaseInterfaceRepository } from '../common/repositories/crud.repository.interface';
import { CreateTestDto } from './dto/create.test.dto';
import { UpdateTestDto } from './dto/update.test.dto';
import { Test } from './entities/test.entity';

@Injectable()
export class TestService {
  constructor(
    @Inject('Test')
    private readonly testRepository: BaseInterfaceRepository<Test>,
  ) {}

  findAll(): Promise<Test[]> {
    return this.testRepository.findAll();
  }

  async findOne(id: string): Promise<Test> {
    return this.testRepository.findOneById(id);
  }

  create(createTestDto: CreateTestDto): Promise<Test> {
    createTestDto.items = createTestDto.items.map((item) => {
      item.value = item.defaultValue;
      delete item.defaultValue;

      return item;
    });
    return this.testRepository.create(createTestDto);
  }

  async update(id: string, updateTestDto: UpdateTestDto) {
    return this.testRepository.update(id, updateTestDto);
  }

  async remove(id: string) {
    const test = await this.testRepository.findOneById(id);
    return test.delete();
  }
}
