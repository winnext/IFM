import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { Unprotected } from 'nest-keycloak-connect';
import { PathEnums } from 'src/common/const/path.enum';

import { RoomTopics } from 'src/common/const/kafta.topic.enum';
import { RoomHistoryService } from 'src/history/room.history.service';

/**
 * message broker controller
 */
@Controller('messagebroker')
@Unprotected()
export class MessagebrokerController {
  constructor(private roomHistoryService: RoomHistoryService) {} //  private facilityHistoryService: FacilityHistoryService,

  /**
   * consume message from kafka queue for ROOM_EXCEPTIONS
   */
  @MessagePattern(RoomTopics.ROOM_EXCEPTIONS)
  exceptionListener(@Payload() message): any {
    console.log('this is from user message broker exception listener' + message.value);
  }

  /**
   * consume message from kafka queue for ROOM_LOGGER
   */
  @MessagePattern(RoomTopics.ROOM_LOGGER)
  loggerListener(@Payload() message): any {
    console.log('this is from user message broker logger listener' + message.value);
  }

  /**
   * consume message from kafka queue for ROOM_OPERATION
   */
  @EventPattern(RoomTopics.ROOM_OPERATION)
  async operationListener(@Payload() message): Promise<any> {
    switch (message.key) {
      case PathEnums.ROOM:
        const roomHistory = { room: message.value.responseBody, user: message.value.user };
        await this.roomHistoryService.create(roomHistory);
        break;

      default:
        console.log('undefined history call from room microservice');
        break;
    }
  }
}
