import { Injectable, OnModuleInit } from "@nestjs/common";

import { Producer } from "kafkajs";
import { IQueueService } from "./queueInterface";

@Injectable()
export class PostKafka {
  constructor(private service: IQueueService) {}

  producer: Producer = this.service.producer();

  async producerSendMessage(topicName: string, message: string) {
    await this.producer.connect();
    await this.producer.send({
      topic: topicName,
      messages: [
        {
          value: message,
        },
      ],
    });
    await this.producer.disconnect();
  }
}
