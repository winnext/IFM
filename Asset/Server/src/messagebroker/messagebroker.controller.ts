import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { Unprotected } from 'nest-keycloak-connect';
import { PathEnums } from 'src/common/const/path.enum';

import { AssetTopics } from 'src/common/const/kafta.topic.enum';

@Controller('messagebroker')
@Unprotected()
export class MessagebrokerController {
  constructor() {}

  @MessagePattern(AssetTopics.ASSET_EXCEPTIONS)
  exceptionListener(@Payload() message): any {
    console.log('this is from message broker exception listener' + message.value);
  }

  @MessagePattern(AssetTopics.ASSET_LOGGER)
  loggerListener(@Payload() message): any {
    console.log('this is from message broker logger listener' + message.value);
  }

  @EventPattern(AssetTopics.ASSET_OPERATION)
  async operationListener(@Payload() message): Promise<any> {
    // console.log(message.key);
    const { responseBody, user, requestInformation } = message.value;

    switch (message.key) {
      case PathEnums.ASSET:
        console.log('facility history topic');
        const assetHistory = {
          asset: responseBody,
          user,
          requestInformation,
        };
        // console.log(facilityHistory);
        // await this.facilityHistoryService.create(facilityHistory);
        break;

      default:
        console.log('undefined history call from facility microservice');
        break;
    }
  }
}
