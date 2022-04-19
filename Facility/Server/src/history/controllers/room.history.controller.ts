import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Unprotected } from 'nest-keycloak-connect';
import { PaginationParams } from 'src/common/commonDto/pagination.dto';
import { NoCache } from 'src/common/interceptors/http.cache.interceptor';
import { RoomHistory } from '../entities/room.history.entity';
import { RoomHistoryService } from '../services/room.history.service';

/**
 *  User  History Controller
 */
@ApiTags('Room_History')
@Controller('roomHistory')
@Unprotected()
export class RoomHistoryController {
  constructor(private readonly roomHistoryService: RoomHistoryService) {}

  /**
   *  get All User  History
   */
  @Get('/')
  @NoCache()
  async getAll(@Query() query: PaginationParams): Promise<RoomHistory[]> {
    return await this.roomHistoryService.findAll(query);
  }

  /**
   *  get specific User  History with ıd
   */
  @Get(':id')
  @NoCache()
  async getFacilityHistory(@Param('id') _id: string): Promise<RoomHistory[]> {
    return await this.roomHistoryService.findOne(_id);
  }
}
