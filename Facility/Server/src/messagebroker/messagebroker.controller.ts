import { CACHE_MANAGER, Controller, Inject } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { Unprotected } from 'nest-keycloak-connect';
import { PathEnums } from 'src/common/const/path.enum';

import { FacilityTopics } from 'src/common/const/kafta.topic.enum';
import { ClassificationHistoryService } from 'src/history/classification.history.service';
import { FacilityHistoryService } from 'src/history/facility.history.service';
import { Cache } from 'cache-manager';

@Controller('messagebroker')
@Unprotected()
export class MessagebrokerController {
  constructor(
    private facilityHistoryService: FacilityHistoryService,
    private classificationHistoryService: ClassificationHistoryService, // @Inject(CACHE_MANAGER) private cacheManager: Cache,
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
    switch (message.key) {
      case PathEnums.FACILITY:
        const facilityHistory = { facility: message.value.responseBody, user: message.value.user };
        await this.facilityHistoryService.create(facilityHistory);
        //  await this.cacheManager.del(PathEnums.FACILITY, () => console.log('clear facility cache is done'));
        break;
      case PathEnums.CLASSIFICATION:
        //  await this.cacheManager.del(PathEnums.CLASSIFICATION, () => console.log('clear classification cache is done'));
        const classificationHistory = { classification: message.value.responseBody, user: message.value.user };
        await this.classificationHistoryService.create(classificationHistory);
        break;
      default:
        console.log('undefined history call from facility microservice');
        break;
    }
  }
}
