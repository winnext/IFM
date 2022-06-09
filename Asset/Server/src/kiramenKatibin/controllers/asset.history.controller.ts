import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NoCache } from 'ifmcommon';
import { Unprotected } from 'nest-keycloak-connect';
import { PaginationParams } from 'src/common/commonDto/pagination.dto';
import { AssetHistory } from '../entities/asset.history.entity';
import { AssetHistoryService } from '../services/asset.history.service';

/**
 *  User  History Controller
 */
@ApiTags('Asset_History')
@Controller('assetHistory')
@Unprotected()
export class AssetHistoryController {
  constructor(private readonly assetHistoryService: AssetHistoryService) {}

  /**
   *  get All User  History
   */
  @Get('/')
  @NoCache()
  async getAll(@Query() query: PaginationParams): Promise<AssetHistory[]> {
    return await this.assetHistoryService.findAll(query);
  }

  /**
   *  get specific User  History with ıd
   */
  @Get(':id')
  @NoCache()
  async getFacilityHistory(@Param('id') _id: string): Promise<AssetHistory[]> {
    return await this.assetHistoryService.findOne(_id);
  }
}
