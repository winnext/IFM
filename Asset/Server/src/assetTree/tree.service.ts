import { Inject, Injectable } from '@nestjs/common';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { Span, OtelMethodCounter } from 'nestjs-otel';
import { BaseGraphDatabaseInterfaceRepository } from 'ifmcommon';
import { CreateTreeDto } from './dto/create.tree.dto';
import { UpdateTreeDto } from './dto/update.tree.dto';
import { CreateTestDto } from './dto/create.test.dto';

@Injectable()
export class TreeService {
  constructor(
    @Inject(RepositoryEnums.ASSET_TREE)
    private readonly treeRepository: BaseGraphDatabaseInterfaceRepository<any>,
  ) {}

  @Span('create a classification')
  @OtelMethodCounter()
  async create(createClassificationDto: CreateTreeDto) {
    return await this.treeRepository.create(createClassificationDto);
  }

  @Span('create a classification')
  @OtelMethodCounter()
  async createTestRelation(createClassificationDto: CreateTestDto) {
    return await this.treeRepository.create(createClassificationDto);
  }

  @Span('find all classifications')
  @OtelMethodCounter()
  async findAll(query) {
    return await this.treeRepository.findAll(query);
  }

  @Span('find a classification by id')
  @OtelMethodCounter()
  async findOne(id: string) {
    //checkObjectIddİsValid(id);
    return await this.treeRepository.findOneById(id);
  }

  @Span('update a classification')
  @OtelMethodCounter()
  async update(id: string, updateClassificationDto: UpdateTreeDto) {
    //checkObjectIddİsValid(id);
    return await this.treeRepository.update(id, updateClassificationDto);
  }

  @Span('remove a classification')
  @OtelMethodCounter()
  async remove(id: string) {
    return await this.treeRepository.delete(id);
  }
  @Span('change none branch')
  @OtelMethodCounter()
  async changeNodeBranch(id: string, target_parent_id: string) {
    return await this.treeRepository.changeNodeBranch(id, target_parent_id);
  }

  @Span('find a classification node by key')
  @OtelMethodCounter()
  async findOneNode(key: string) {
    //checkObjectIddİsValid(id);
    return await this.treeRepository.findOneNodeByKey(key);
  }
}
