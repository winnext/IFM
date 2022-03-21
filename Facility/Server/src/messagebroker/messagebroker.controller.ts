import { Controller, Inject } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { Unprotected } from 'nest-keycloak-connect';

import { FacilityTopics } from 'src/common/const/kafta.topic.enum';
import { ClassificationHistoryService } from 'src/history/classification.historyservice';
import { FacilityHistoryService } from 'src/history/facility.historry.service';

@Controller('messagebroker')
@Unprotected()
export class MessagebrokerController {
  constructor(
    private facilityHistoryService: FacilityHistoryService,
    private classificationHistoryService: ClassificationHistoryService,
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
}
