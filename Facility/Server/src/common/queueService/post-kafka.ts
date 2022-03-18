import { Injectable } from '@nestjs/common';

import { Producer } from 'kafkajs';
import { IQueueService } from './queueInterface';

@Injectable()
export class PostKafka {
  constructor(private service: IQueueService) {}

  producer: Producer = this.service.producer();

  async producerSendMessage(topicName: string, message: string, key?: string) {
    await this.producer.connect();
    await this.producer.send({
      topic: topicName,
      messages: [
        {
          key: key || '',
          value: message,
        },
      ],
    });
    await this.producer.disconnect();
  }
}
