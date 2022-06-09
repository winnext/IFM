import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Unprotected } from 'nest-keycloak-connect';
import { PaginationParams } from 'src/common/commonDto/pagination.dto';
import { NoCache } from 'ifmcommon';
import { TreeHistoryService } from '../services/tree.history.service';
import { TreeHistory } from '../entities/tree.history.entity';

@ApiTags('Tree_History')
@Controller('treeHistory')
@Unprotected()
export class TreeHistoryController {
  constructor(private readonly treeHistoryService: TreeHistoryService) {}

  @Get('')
  @NoCache()
  async getAllClassification(@Query() query: PaginationParams): Promise<TreeHistory[]> {
    return await this.treeHistoryService.findAll(query);
  }
  @Get(':labelclass')
  @NoCache()
  async getClassificationHistory(@Param('labelclass') _id: string): Promise<TreeHistory[]> {
    return await this.treeHistoryService.findOne(_id);
  }
}
