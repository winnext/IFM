import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { Unprotected } from 'nest-keycloak-connect';
import { PathEnums } from 'src/common/const/path.enum';

import { FacilityTopics } from 'src/common/const/kafta.topic.enum';
import { ClassificationHistoryService } from 'src/history/classification.history.service';
import { FacilityHistoryService } from 'src/history/facility.history.service';
import { FacilityStructureHistoryService } from 'src/history/facilitystructure.history.service';

@Controller('messagebroker')
@Unprotected()
export class MessagebrokerController {
  constructor(
    private facilityHistoryService: FacilityHistoryService,
    private classificationHistoryService: ClassificationHistoryService,
    private facilityStructureHistoryService: FacilityStructureHistoryService,
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
    // console.log(message.key);
    switch (message.key) {
      case PathEnums.FACILITY:
        const facilityHistory = { facility: message.value.responseBody, user: message.value.user };
        await this.facilityHistoryService.create(facilityHistory);
        break;
      case PathEnums.CLASSIFICATION:
        const classificationHistory = { classification: message.value.responseBody, user: message.value.user };
        await this.classificationHistoryService.create(classificationHistory);
        break;
      case PathEnums.STRUCTURE:
        const facilityStructureHistory = { facilityStructure: message.value.responseBody, user: message.value.user };
        await this.facilityStructureHistoryService.create(facilityStructureHistory);
        console.log('structure topic added');
        break;
      default:
        console.log('undefined history call from facility microservice');
        break;
    }
  }
}
