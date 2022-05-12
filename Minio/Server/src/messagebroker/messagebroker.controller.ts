import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Unprotected } from 'nest-keycloak-connect';
import { MinioTopis } from 'src/common/const/kafta.topic.enum';

import { MinioClientService } from 'src/minio-client/minio-client.service';

/**
 * message broker controller
 */
@Controller('messagebroker')
@Unprotected()
export class MessagebrokerController {
  constructor(private minioClientService: MinioClientService) {}
  /**
   * consume message from kafka queue for USER_EXCEPTIONS
   * //message containes  file buffer for image,pdf,xlsx
   */
  @MessagePattern(MinioTopis.MINIO_EXCEPTIONS)
  exceptionListener(@Payload() message): any {
    console.log('this is from user message broker exception listener' + message.value);
  }

  @MessagePattern('test2')
  async test2(@Payload() message) {
    await this.minioClientService.upload(message.value);
    console.log('this is from test2 topic' + message.value);
  }
}
