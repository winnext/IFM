import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Unprotected } from 'nest-keycloak-connect';
import { PaginationParams } from 'src/common/commonDto/pagination.dto';
import { NoCache } from 'src/common/interceptors/http.cache.interceptor';

import { ClassificationHistory } from './entities/classification.history.entity';
import { FacilityHistory } from './entities/facility.history.entity';
import { FacilityHistoryService } from './facility.history.service';

@ApiTags('Facility_History')
@Controller('facilityHistory')
@Unprotected()
export class FacilityHistoryController {
  constructor(private readonly facilityHistoryService: FacilityHistoryService) {}

  @Get('/')
  @NoCache()
  async getAll(@Query() query: PaginationParams): Promise<FacilityHistory[]> {
    return await this.facilityHistoryService.findAll(query);
  }

  @Get(':id')
  @NoCache()
  async getFacilityHistory(@Param('id') _id: string): Promise<ClassificationHistory[]> {
    return await this.facilityHistoryService.findOne(_id);
  }
}
