import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { Unprotected } from 'nest-keycloak-connect';
import { AssetTopics } from 'src/common/const/kafta.topic.enum';
import { PathEnums } from 'src/common/const/path.enum';
import { TreeHistoryService } from 'src/kiramenKatibin/services/tree.history.service';
import { AssetHistoryService } from 'src/kiramenKatibin/services/asset.history.service';

@Controller('messagebroker')
@Unprotected()
export class MessagebrokerController {
  constructor(private treeHistoryService: TreeHistoryService, private assetHistoryService: AssetHistoryService) {}

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
      case PathEnums.TREE:
        console.log(' Tree history topic');
        const classificationHistory = { tree: responseBody, user, requestInformation };
        await this.treeHistoryService.create(classificationHistory);
        break;
      case PathEnums.ASSET:
        console.log('Asset history topic');
        const roomHistory = { asset: responseBody, user, requestInformation };
        await this.assetHistoryService.create(roomHistory);
        console.log('asset topic added');
        break;
      default:
        console.log('undefined history call from asset microservice');
        break;
    }
  }
}
