import { Inject, Injectable } from '@nestjs/common';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { checkObjectIddİsValid } from 'src/common/func/objectId.check';
import { BaseInterfaceRepository } from 'src/common/repositories/crud.repository.interface';
import { CreateFacilityHistoryDto } from './dtos/create.facility.history.dto';
import { FacilityHistory } from './entities/facility.history.entity';

@Injectable()
export class FacilityHistoryService {
  constructor(
    @Inject(RepositoryEnums.FACILITY_HISTORY)
    private readonly facilityHistoryRepository: BaseInterfaceRepository<FacilityHistory>,
  ) {}
  async create(createFacilityHistoryDto: CreateFacilityHistoryDto) {
    return await this.facilityHistoryRepository.create(createFacilityHistoryDto);
  }

  async findAll(query) {
    return await this.facilityHistoryRepository.findAll(query);
  }

  async findOne(id: string) {
    checkObjectIddİsValid(id);
    return await this.facilityHistoryRepository.findOneById(id);
  }
}
