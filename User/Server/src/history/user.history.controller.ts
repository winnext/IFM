import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Unprotected } from 'nest-keycloak-connect';
import { PaginationParams } from 'src/common/commonDto/pagination.dto';
import { NoCache } from 'src/common/interceptors/http.cache.interceptor';
import { UserHistory } from './entities/user.history.entity';
import { UserHistoryService } from './user.history.service';

@ApiTags('User_History')
@Controller('userHistory')
@Unprotected()
export class UserHistoryController {
  constructor(private readonly useristoryService: UserHistoryService) {}

  @Get('/')
  @NoCache()
  async getAll(@Query() query: PaginationParams): Promise<UserHistory[]> {
    return await this.useristoryService.findAll(query);
  }

  @Get(':id')
  @NoCache()
  async getFacilityHistory(@Param('id') _id: string): Promise<UserHistory[]> {
    return await this.useristoryService.findOne(_id);
  }
}
