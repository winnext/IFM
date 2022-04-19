import { Inject, Injectable } from '@nestjs/common';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { checkObjectIddİsValid } from 'src/common/func/objectId.check';
import { BaseHistoryRepositoryInterface } from 'src/common/repositories/history.repository.interface';

import { Span, OtelMethodCounter } from 'nestjs-otel';
import { CreateFacilityHistoryDto } from '../dtos/create.facility.history.dto';
import { FacilityHistory } from '../entities/facility.history.entity';

@Injectable()
export class FacilityHistoryService {
  constructor(
    @Inject(RepositoryEnums.FACILITY_HISTORY)
    private readonly facilityHistoryRepository: BaseHistoryRepositoryInterface<FacilityHistory>,
  ) {}

  async create(createFacilityHistoryDto: CreateFacilityHistoryDto) {
    return await this.facilityHistoryRepository.create(createFacilityHistoryDto);
  }

  @Span('find all histories of the facilities')
  @OtelMethodCounter()
  async findAll(query) {
    return await this.facilityHistoryRepository.findAll(query);
  }

  @Span('find one a history of the facility by id')
  @OtelMethodCounter()
  async findOne(id: string) {
    checkObjectIddİsValid(id);
    return await this.facilityHistoryRepository.findOneById(id);
  }
}
