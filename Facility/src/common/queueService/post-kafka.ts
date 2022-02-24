import { Injectable, OnModuleInit } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { Producer } from "kafkajs";
import { IQueueService } from "./queueInterface";

@Injectable()
export class PostKafka {
  constructor(private service: IQueueService) {}

  producer: Producer = this.service.producer();

  async producerTest(topicName: string, message: string) {
    await this.producer.connect();
    await this.producer.send({
      topic: topicName,
      messages: [
        {
          value: message,
          key: "123",
        },
      ],
    });
    await this.producer.disconnect()
  }
}
