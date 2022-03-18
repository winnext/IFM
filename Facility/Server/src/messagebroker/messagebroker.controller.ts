import { Controller, Get, Query } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { Unprotected } from 'nest-keycloak-connect';
import { PaginationParams } from 'src/common/commonDto/pagination.dto';
import { FacilityTopics } from 'src/common/const/kafta.topic.enum';
import { ClassificationHistoryService } from './classification.historyservice';
import { ClassificationHistory } from './entities/classification.history.entity';
import { FacilityHistory } from './entities/facility.history.entity';
import { FacilityHistoryService } from './facility.historry.service';

@Controller('messagebroker')
@Unprotected()
export class MessagebrokerController {
  constructor(
    private readonly facilityHistoryService: FacilityHistoryService,
    private readonly classificationHistoryService: ClassificationHistoryService,
  ) {}

  @MessagePattern(FacilityTopics.FACILITY_EXCEPTIONS)
  exceptionListener(@Payload() message): any {
    console.log('this is from message broker exception listener' + message.value);
  }

  @MessagePattern(FacilityTopics.FACILITY_LOGGER)
  loggerListener(@Payload() message): any {
    console.log('this is from message broker logger listener' + message.value);
  }

  @EventPattern(FacilityTopics.FACILITY_OPERATION)
  async operationListener(@Payload() message): Promise<any> {
    console.log(message.key);
    if (message.key === '/facility') {
      console.log('facility history');
      const facility = { facility: message.value };
      await this.facilityHistoryService.create(facility);
    } else {
      console.log('classification history');
      const classification = { classification: message.value };
      await this.classificationHistoryService.create(classification);
    }
  }

  @Get('/facility')
  async getAll(@Query() query: PaginationParams): Promise<FacilityHistory[]> {
    return await this.facilityHistoryService.findAll(query);
  }

  @Get('classification')
  async getAllClassification(@Query() query: PaginationParams): Promise<ClassificationHistory[]> {
    return await this.classificationHistoryService.findAll(query);
  }
}
