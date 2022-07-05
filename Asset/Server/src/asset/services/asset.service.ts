import { Inject, Injectable } from '@nestjs/common';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { GeciciInterface } from 'src/common/interface/gecici.interface';
import { CreateAssetDto } from '../dto/create-asset.dto';
import { UpdateAssetDto } from '../dto/update-asset.dto';

@Injectable()
export class AssetService {
  constructor(
    @Inject(RepositoryEnums.FACILITY_STRUCTURE)
    private readonly assetRepository: GeciciInterface<any>,
  ) {}
  async create(createAssetDto: CreateAssetDto) {
    return await this.assetRepository.create(createAssetDto);
  }

  findOne(label: string, realm: string) {
    return this.assetRepository.findOneByRealm(label, realm);
  }

  update(id: string, updateAssetDto: UpdateAssetDto) {
    return this.assetRepository.update(id, updateAssetDto);
  }

  remove(id: string) {
    return this.assetRepository.delete(id);
  }

  async changeNodeBranch(id: string, target_parent_id: string) {
    return await this.assetRepository.changeNodeBranch(id, target_parent_id);
  }

  // async findOneNode(key: string) {
  //   //checkObjectIddİsValid(id);
  //   return await this.assetRepository.findOneNodeByKey(key);
  // }

  async findOneNodeById(id: string) {
    //checkObjectIddİsValid(id);
    return await this.assetRepository.findOneNodeById(id);
  }
}
