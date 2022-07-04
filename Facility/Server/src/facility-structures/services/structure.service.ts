import { Inject, Injectable } from '@nestjs/common';
import { BaseGraphDatabaseInterfaceRepository } from 'ifmcommon';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { GeciciInterface } from 'src/common/interface/gecici.interface';

import { CreateFacilityStructureDto } from '../dto/create-facility-structure.dto';
import { UpdateFacilityStructureDto } from '../dto/update-facility-structure.dto';

@Injectable()
export class StructureService {
  constructor(
    @Inject(RepositoryEnums.FACILITY_STRUCTURE)
    private readonly facilityStructureRepository: GeciciInterface<any>,
  ) {}
  async create(createFacilityStructureDto: CreateFacilityStructureDto) {
    return await this.facilityStructureRepository.create(createFacilityStructureDto);
  }

  findOne(label: string, realm: string) {
    return this.facilityStructureRepository.findOneByRealm(label, realm);
  }

  update(id: string, updateFacilityStructureDto: UpdateFacilityStructureDto) {
    return this.facilityStructureRepository.update(id, updateFacilityStructureDto);
  }

  remove(id: string) {
    return this.facilityStructureRepository.delete(id);
  }

  async changeNodeBranch(id: string, target_parent_id: string) {
    return await this.facilityStructureRepository.changeNodeBranch(id, target_parent_id);
  }

  async findOneNode(key: string) {
    //checkObjectIddİsValid(id);
    return await this.facilityStructureRepository.findOneNodeByKey(key);
  }
}
