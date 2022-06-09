import { Inject, Injectable } from '@nestjs/common';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { BaseHistoryRepositoryInterface } from 'ifmcommon';
import { Span, OtelMethodCounter } from 'nestjs-otel';
import { TreeHistory } from '../entities/tree.history.entity';
import { CreateTreeHistoryDto } from '../dtos/create.tree.history.dto';

@Injectable()
export class TreeHistoryService {
  constructor(
    @Inject(RepositoryEnums.ASSET_TREE_HISTORY)
    private readonly treeHistoryRepository: BaseHistoryRepositoryInterface<TreeHistory>,
  ) {}

  async create(createTreeHistoryDto: CreateTreeHistoryDto) {
    return await this.treeHistoryRepository.create(createTreeHistoryDto);
  }

  @Span('find all history of the classifications')
  @OtelMethodCounter()
  async findAll(query) {
    return await this.treeHistoryRepository.findAll(query);
  }

  @Span('find a history of the classification by id')
  @OtelMethodCounter()
  async findOne(id: string) {
    return await this.treeHistoryRepository.findOneById(id);
  }
}
