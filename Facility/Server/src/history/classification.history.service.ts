import { Inject, Injectable } from '@nestjs/common';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { checkObjectIddİsValid } from 'src/common/func/objectId.check';
import { BaseHistoryRepositoryInterface } from 'src/common/repositories/history.repository.interface';
import { CreateClassificationHistoryDto } from './dtos/create.classification.history.dto';
import { ClassificationHistory } from './entities/classification.history.entity';

@Injectable()
export class ClassificationHistoryService {
  constructor(
    @Inject(RepositoryEnums.CLASSIFICATION_HISTORY)
    private readonly classificationHistoryRepository: BaseHistoryRepositoryInterface<ClassificationHistory>,
  ) {}
  async create(createFacilityHistoryDto: CreateClassificationHistoryDto) {
    return await this.classificationHistoryRepository.create(createFacilityHistoryDto);
  }

  async findAll(query) {
    return await this.classificationHistoryRepository.findAll(query);
  }

  async findOne(id: string) {
    checkObjectIddİsValid(id);
    return await this.classificationHistoryRepository.findOneById(id);
  }
}
