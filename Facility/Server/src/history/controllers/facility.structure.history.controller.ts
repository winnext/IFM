import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Unprotected } from 'nest-keycloak-connect';
import { PaginationParams } from 'src/common/commonDto/pagination.dto';
import { NoCache } from 'src/common/interceptors/http.cache.interceptor';
import { FacilityStructureHistory } from '../entities/facilitystructure.history.entity';
import { FacilityStructureHistoryService } from '../services/facilitystructure.history.service';

@ApiTags('Facility_Structure_History')
@Controller('facilityStructureHistory')
@Unprotected()
export class FacilityStructureHistoryController {
  constructor(private readonly facilityStructureHistoryService: FacilityStructureHistoryService) {}

  @Get('/')
  @NoCache()
  async getAll(@Query() query: PaginationParams): Promise<FacilityStructureHistory[]> {
    return await this.facilityStructureHistoryService.findAll(query);
  }

  @Get(':id')
  @NoCache()
  async getFacilityHistory(@Param('id') _id: string): Promise<FacilityStructureHistory[]> {
    return await this.facilityStructureHistoryService.findOne(_id);
  }
}
