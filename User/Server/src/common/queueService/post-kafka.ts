import { Injectable } from '@nestjs/common';

import { Producer } from 'kafkajs';
import { IQueueService } from './queueInterface';
import { v4 as uuidv4 } from 'uuid';

/**
 * Kafka Message Broker Service(Producer & Consumer)
 */
@Injectable()
export class PostKafka {
  /**
   * Inject IQeueueService
   */
  constructor(private service: IQueueService) {}

  /**
   * producer from interface
   */
  producer: Producer = this.service.producer();
  /**
   * Send topic with producer to kafka queue
   */
  async producerSendMessage(topicName: string, message: string, key?: string) {
    await this.producer.connect();
    await this.producer.send({
      topic: topicName,
      messages: [
        {
          key: key || uuidv4(),
          value: message,
        },
      ],
    });
    await this.producer.disconnect();
  }
}
