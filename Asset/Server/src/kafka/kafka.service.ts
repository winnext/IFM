import { Injectable, Inject } from '@nestjs/common';

import { Producer } from 'kafkajs';

import { KAFKA_PRODUCER } from './kafka.constants';

import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class KafkaService {
  private readonly producer: Producer;

  constructor(@Inject(KAFKA_PRODUCER) producer: Producer) {
    this.producer = producer;
  }

  async producerSendMessage(topicName: string, message: string, key?: string) {
    try {
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
    } catch (error) {
      console.log(error);
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
}
