import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { Unprotected } from 'nest-keycloak-connect';
import { PathEnums } from 'src/common/const/path.enum';

import { UserTopics } from 'src/common/const/kafta.topic.enum';
import { UserHistoryService } from 'src/kiramenKatibin/user.history.service';

/**
 * message broker controller
 */
@Controller('messagebroker')
@Unprotected()
export class MessagebrokerController {
  constructor(private userHistoryService: UserHistoryService) {} //  private facilityHistoryService: FacilityHistoryService,

  /**
   * consume message from kafka queue for USER_EXCEPTIONS
   */
  @MessagePattern(UserTopics.USER_EXCEPTIONS)
  exceptionListener(@Payload() message): any {
    console.log('this is from user message broker exception listener' + message.value);
  }

  /**
   * consume message from kafka queue for USER_LOGGER
   */
  @MessagePattern(UserTopics.USER_LOGGER)
  loggerListener(@Payload() message): any {
    console.log('this is from user message broker logger listener' + message.value);
  }

  /**
   * consume message from kafka queue for USER_OPERATION
   */
  @EventPattern(UserTopics.USER_OPERATION)
  async operationListener(@Payload() message): Promise<any> {
    const { responseBody, user, requestInformation } = message.value;
    switch (message.key) {
      case PathEnums.USER:
        const userHistory = { user: responseBody, keycloack_user: user, requestInformation };
        await this.userHistoryService.create(userHistory);
        break;

      default:
        console.log('undefined history call from user microservice');
        console.log(message.key);
        break;
    }
  }
}
