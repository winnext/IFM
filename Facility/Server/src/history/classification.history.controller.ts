import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Unprotected } from 'nest-keycloak-connect';
import { PaginationParams } from 'src/common/commonDto/pagination.dto';
import { NoCache } from 'src/common/interceptors/http.cache.interceptor';
import { ClassificationHistoryService } from './classification.history.service';
import { ClassificationHistory } from './entities/classification.history.entity';

@ApiTags('Classification_History')
@Controller('classification_history')
@Unprotected()
export class ClassificationHistoryController {
  constructor(private readonly classificationHistoryService: ClassificationHistoryService) {}

  @Get('')
  @NoCache()
  async getAllClassification(@Query() query: PaginationParams): Promise<ClassificationHistory[]> {
    return await this.classificationHistoryService.findAll(query);
  }
  @Get(':id')
  @NoCache()
  async getClassificationHistory(@Param('id') _id: string): Promise<ClassificationHistory[]> {
    return await this.classificationHistoryService.findOne(_id);
  }
}
