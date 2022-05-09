import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Unprotected } from 'nest-keycloak-connect';
import { PaginationParams } from 'src/common/commonDto/pagination.dto';
import { NoCache } from 'ifmcommon';
import { UserHistory } from './entities/user.history.entity';
import { UserHistoryService } from './user.history.service';

/**
 *  User  History Controller
 */
@ApiTags('User_History')
@Controller('userHistory')
@Unprotected()
export class UserHistoryController {
  constructor(private readonly useristoryService: UserHistoryService) {}

  /**
   *  get All User  History
   */
  @Get('/')
  @NoCache()
  async getAll(@Query() query: PaginationParams): Promise<UserHistory[]> {
    return await this.useristoryService.findAll(query);
  }

  /**
   *  get specific User  History with ıd
   */
  @Get(':_id')
  @NoCache()
  async getFacilityHistory(@Param('_id') _id: string): Promise<UserHistory[]> {
    return await this.useristoryService.findOne(_id);
  }
}
