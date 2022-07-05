import { Injectable, Inject, OnModuleInit } from '@nestjs/common';

import { KafkaConfig, Producer } from 'kafkajs';

import { KAFKA_OPTIONS, KAFKA_PRODUCER } from './kafka.constants';

import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class KafkaService {
  private readonly producer;
  private readonly config: KafkaConfig;

  constructor(@Inject(KAFKA_OPTIONS) config: KafkaConfig, @Inject(KAFKA_PRODUCER) producer: Producer) {
    this.producer = producer;
    this.config = config;
  }

  getDriver() {
    return this.producer;
  }

  getConfig(): KafkaConfig {
    return this.config;
  }

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

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
}
