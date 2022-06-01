import { Inject, Injectable } from '@nestjs/common';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { BaseHistoryRepositoryInterface } from 'ifmcommon';

import { Span, OtelMethodCounter } from 'nestjs-otel';
import { CreateClassificationHistoryDto } from '../dtos/create.classification.history.dto';
import { ClassificationHistory } from '../entities/classification.history.entity';

@Injectable()
export class ClassificationHistoryService {
  constructor(
    @Inject(RepositoryEnums.CLASSIFICATION_HISTORY)
    private readonly classificationHistoryRepository: BaseHistoryRepositoryInterface<ClassificationHistory>,
  ) {}

  async create(createFacilityHistoryDto: CreateClassificationHistoryDto) {
    return await this.classificationHistoryRepository.create(createFacilityHistoryDto);
  }

  @Span('find all history of the classifications')
  @OtelMethodCounter()
  async findAll(query) {
    return await this.classificationHistoryRepository.findAll(query);
  }

  @Span('find a history of the classification by id')
  @OtelMethodCounter()
  async findOne(id: string) {
    return await this.classificationHistoryRepository.findOneById(id);
  }
}
