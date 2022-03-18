import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FacilityTopics } from 'src/common/const/kafta.topic.enum';

@Controller('messagebroker')
export class MessagebrokerController {
  @MessagePattern(FacilityTopics.FACILITY_EXCEPTIONS)
  exceptionListener(@Payload() message): any {
    console.log('this is from message broker exception listener' + message.value);
  }

  @MessagePattern(FacilityTopics.FACILITY_LOGGER)
  loggerListener(@Payload() message): any {
    console.log('this is from message broker logger listener' + message.value);
  }

  @MessagePattern(FacilityTopics.FACILITY_OPERATION)
  operationListener(@Payload() message): any {
    console.log('this is from operation message listener' + message.value);
  }
}
