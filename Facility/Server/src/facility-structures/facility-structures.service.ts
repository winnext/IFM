import { Inject, Injectable } from '@nestjs/common';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { BaseInterfaceRepository } from 'src/common/repositories/crud.repository.interface';
import { BaseGraphDatabaseInterfaceRepository } from 'src/common/repositories/graph.database.crud.interface';
import { CreateFacilityStructureDto } from './dto/create-facility-structure.dto';
import { UpdateFacilityStructureDto } from './dto/update-facility-structure.dto';
import { FacilityStructure } from './entities/facility-structure.entity';

@Injectable()
export class FacilityStructuresService {
  constructor(
    @Inject(RepositoryEnums.FACILITY_STRUCTURE)
    private readonly facilityStructureRepository: BaseGraphDatabaseInterfaceRepository<any>,
  ) {}
  create(createFacilityStructureDto: CreateFacilityStructureDto) {
    return this.facilityStructureRepository.create(createFacilityStructureDto);
  }

  findAll(queryParams,class_name) {
    return this.facilityStructureRepository.findAll(queryParams,class_name);
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


  async changeNodeBranch(id: string, target_parent_id: string) {
    return await this.facilityStructureRepository.changeNodeBranch(id, target_parent_id);
  }

  async findOneNode(key: string) {
    //checkObjectIddİsValid(id);
    return await this.facilityStructureRepository.findOneNodeByKey(key);
  }
}
