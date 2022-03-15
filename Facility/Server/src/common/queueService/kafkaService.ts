import { ConfigService } from '@nestjs/config';
import { Kafka, Producer } from 'kafkajs';
import { IQueueService } from './queueInterface';

export class KafkaService implements IQueueService {
  configService: ConfigService;
  kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: [process.env.KAFKA_BROKER],
  });

  producer(): Producer {
    try {
      const producer = this.kafka.producer({ allowAutoTopicCreation: false });
      return producer;
    } catch (error) {
      console.log(error);
    }
  }
}
