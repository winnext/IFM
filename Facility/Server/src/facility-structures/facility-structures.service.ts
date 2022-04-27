import { Inject, Injectable } from '@nestjs/common';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { BaseInterfaceRepository } from 'ifmcommon';
import { CreateFacilityStructureDto } from './dto/create-facility-structure.dto';
import { UpdateFacilityStructureDto } from './dto/update-facility-structure.dto';
import { FacilityStructure } from './entities/facility-structure.entity';

@Injectable()
export class FacilityStructuresService {
  constructor(
    @Inject(RepositoryEnums.FACILITY_STRUCTURE)
    private readonly facilityStructureRepository: BaseInterfaceRepository<FacilityStructure>,
  ) {}
  create(createFacilityStructureDto: CreateFacilityStructureDto) {
    return this.facilityStructureRepository.create(createFacilityStructureDto);
  }

  findAll(queryParams) {
    return this.facilityStructureRepository.findAll(queryParams);
  }

  findOne(id: string) {
    return this.facilityStructureRepository.findOneById(id);
  }

  update(id: string, updateFacilityStructureDto: UpdateFacilityStructureDto) {
    return this.facilityStructureRepository.update(id, updateFacilityStructureDto);
  }

  remove(id: string) {
    return this.facilityStructureRepository.delete(id);
  }
}
