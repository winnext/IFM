import { Inject, Injectable } from '@nestjs/common';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { VirtualNodeInterface } from 'src/common/interface/relation.node.interface';
import { CreateAssetRelationDto } from '../dto/asset.relation.dto';

@Injectable()
export class AssetRelationService {
  constructor(
    @Inject(RepositoryEnums.ASSET_STRUCTURE_RELATION)
    private readonly AssetRelationsRepository: VirtualNodeInterface<any>,
  ) {}
  async create(id: string, createAssetRelationDto: CreateAssetRelationDto) {
    return await this.AssetRelationsRepository.create(id, createAssetRelationDto);
  }

  findOne(id: string) {
    return this.AssetRelationsRepository.findOneById(id);
  }

  remove(id: string) {
    return this.AssetRelationsRepository.delete(id);
  }

  async findOneNode(key: string) {
    //checkObjectIddİsValid(id);
    return await this.AssetRelationsRepository.findOneNodeByKey(key);
  }
}
