import { Inject, Injectable } from '@nestjs/common';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { checkObjectIddİsValid } from 'ifmcommon';
import { BaseHistoryRepositoryInterface } from 'ifmcommon';

import { Span, OtelMethodCounter } from 'nestjs-otel';
import { AssetHistory } from '../entities/asset.history.entity';
import { CreateAssetHistoryDto } from '../dtos/create.asset.history.dto';

/**
 *  User  History Service
 */
@Injectable()
export class AssetHistoryService {
  constructor(
    @Inject(RepositoryEnums.ASSET_HISTORY)
    private readonly assetHistoryRepository: BaseHistoryRepositoryInterface<AssetHistory>,
  ) {}

  /**
   * Create User  History
   */
  async create(createAssetHistoryDto: CreateAssetHistoryDto) {
    return await this.assetHistoryRepository.create(createAssetHistoryDto);
  }

  /**
   * Get All User  History
   */
  @Span('find all histories of the user')
  @OtelMethodCounter()
  async findAll(query) {
    return await this.assetHistoryRepository.findAll(query);
  }

  /**
   * find specific User  History
   */
  @Span('find one a history of the asset by id')
  @OtelMethodCounter()
  async findOne(id: string) {
    checkObjectIddİsValid(id);
    return await this.assetHistoryRepository.findOneById(id);
  }
}
