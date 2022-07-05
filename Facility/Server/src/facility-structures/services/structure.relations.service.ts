import { Inject, Injectable } from '@nestjs/common';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { VirtualNodeInterface } from 'src/common/interface/relation.node.interface';
import { CreateAssetRelationDto } from '../dto/asset.relation.dto';
import { UpdateFacilityStructureDto } from '../dto/update-facility-structure.dto';

@Injectable()
export class StructureRelationsService {
  constructor(
    @Inject(RepositoryEnums.FACILITY_STRUCTURE_RELATİON)
    private readonly StructureRelationsRepository: VirtualNodeInterface<any>,
  ) {}
  async create(id: string, createAssetRelationDto: CreateAssetRelationDto) {
    return await this.StructureRelationsRepository.create(id, createAssetRelationDto);
  }

  findOne(id: string) {
    return this.StructureRelationsRepository.findOneById(id);
  }

  update(id: string, updateFacilityStructureDto: UpdateFacilityStructureDto) {
    return this.StructureRelationsRepository.update(id, updateFacilityStructureDto);
  }

  remove(id: string) {
    return this.StructureRelationsRepository.delete(id);
  }

  async changeNodeBranch(id: string, target_parent_id: string) {
    return await this.StructureRelationsRepository.changeNodeBranch(id, target_parent_id);
  }

  async findOneNode(key: string) {
    //checkObjectIddİsValid(id);
    return await this.StructureRelationsRepository.findOneNodeByKey(key);
  }
}
