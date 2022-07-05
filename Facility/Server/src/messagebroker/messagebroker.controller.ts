import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { Unprotected } from 'nest-keycloak-connect';
import { PathEnums } from 'src/common/const/path.enum';

import { FacilityTopics } from 'src/common/const/kafta.topic.enum';
import { ClassificationHistoryService } from 'src/kiramenKatibin/services/classification.history.service';
import { FacilityHistoryService } from 'src/kiramenKatibin/services/facility.history.service';
import { FacilityStructureHistoryService } from 'src/kiramenKatibin/services/facilitystructure.history.service';
import { RoomHistoryService } from 'src/kiramenKatibin/services/room.history.service';

@Controller('messagebroker')
@Unprotected()
export class MessagebrokerController {
  constructor(
    private facilityHistoryService: FacilityHistoryService,
    private classificationHistoryService: ClassificationHistoryService,
    private facilityStructureHistoryService: FacilityStructureHistoryService,
    private roomHistoryService: RoomHistoryService,
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
    const { responseBody, user, requestInformation } = message.value;

    switch (message.key) {
      case PathEnums.FACILITY:
        console.log('facility history topic');
        const facilityHistory = {
          facility: responseBody,
          user,
          requestInformation,
        };
        // console.log(facilityHistory);
        await this.facilityHistoryService.create(facilityHistory);
        break;
      case PathEnums.CLASSIFICATION:
        console.log('Classification history topic');
        const classificationHistory = { classification: responseBody, user, requestInformation };
        await this.classificationHistoryService.create(classificationHistory);
        break;
      case PathEnums.STRUCTURE:
        console.log('facility structure history topic');
        const facilityStructureHistory = {
          facilityStructure: responseBody,
          user,
          requestInformation,
        };
        await this.facilityStructureHistoryService.create(facilityStructureHistory);
        console.log('structure topic added');
        break;
      case PathEnums.ROOM:
        console.log('facility room history topic');
        const roomHistory = { room: responseBody, user, requestInformation };
        await this.roomHistoryService.create(roomHistory);
        console.log('room topic added');
        break;
      default:
        console.log('undefined history call from facility microservice');
        break;
    }
  }
  @MessagePattern('assetRelation')
  testListener(@Payload() message): any {
    console.log(message.value);
  }
}
