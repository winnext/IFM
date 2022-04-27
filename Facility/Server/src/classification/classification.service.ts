import { Inject, Injectable } from '@nestjs/common';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { CreateClassificationDto } from './dto/create-classification.dto';
import { UpdateClassificationDto } from './dto/update-classification.dto';
import { Span, OtelMethodCounter } from 'nestjs-otel';
import { BaseGraphDatabaseInterfaceRepository } from 'src/common/repositories/graph.database.crud.interface';

@Injectable()
export class ClassificationService {
  constructor(
    @Inject(RepositoryEnums.CLASSIFICATION)
    private readonly classificationRepository: BaseGraphDatabaseInterfaceRepository<any>,
  ) {}

  @Span('create a classification')
  @OtelMethodCounter()
  async create(createClassificationDto: CreateClassificationDto) {
    return await this.classificationRepository.create(createClassificationDto);
  }

  @Span('find all classifications')
  @OtelMethodCounter()
  async findAll(query) {
    return await this.classificationRepository.findAll(query);
  }

  @Span('find a classification by id')
  @OtelMethodCounter()
  async findOne(id: string) {
    //checkObjectIddİsValid(id);
    return await this.classificationRepository.findOneById(id);
  }

  @Span('update a classification')
  @OtelMethodCounter()
  async update(id: string, updateClassificationDto: UpdateClassificationDto) {
    //checkObjectIddİsValid(id);
    return await this.classificationRepository.update(id, updateClassificationDto);
  }

  @Span('remove a classification')
  @OtelMethodCounter()
  async remove(id: string) {
    return await this.classificationRepository.delete(id);
  }
  @Span('change none branch')
  @OtelMethodCounter()
  async changeNodeBranch(id: string, target_parent_id: string) {
    return await this.classificationRepository.changeNodeBranch(id, target_parent_id);
  }

  @Span('find a classification node by key')
  @OtelMethodCounter()
  async findOneNode(key: string) {
    //checkObjectIddİsValid(id);
    return await this.classificationRepository.findOneNodeByKey(key);
  }
}
