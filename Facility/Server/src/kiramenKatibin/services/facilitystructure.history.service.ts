import { Inject, Injectable } from '@nestjs/common';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { BaseHistoryRepositoryInterface } from 'ifmcommon';
import { CreateFacilityStructureHistoryDto } from '../dtos/create.facilitystructure.history.dto';
import { FacilityStructureHistory } from '../entities/facilitystructure.history.entity';

@Injectable()
export class FacilityStructureHistoryService {
  constructor(
    @Inject(RepositoryEnums.FACILITY_STRUCTURE_HISTORY)
    private readonly facilityStructureHistoryRepository: BaseHistoryRepositoryInterface<FacilityStructureHistory>,
  ) {}
  async create(createFacilityStructureHistoryDto: CreateFacilityStructureHistoryDto) {
    return await this.facilityStructureHistoryRepository.create(createFacilityStructureHistoryDto);
  }

  async findAll(query) {
    return await this.facilityStructureHistoryRepository.findAll(query);
  }

  async findOne(id: string) {
    return await this.facilityStructureHistoryRepository.findOneById(id);
  }
}
