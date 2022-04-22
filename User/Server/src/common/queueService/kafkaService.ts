import { Kafka, Producer } from 'kafkajs';
import { IQueueService } from './queueInterface';

/**
 *  Kafka Service
 */
export class KafkaService implements IQueueService {
  /**
   * Create Kafka Client
   */
  kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: [process.env.KAFKA_BROKER],
  });
  /**
   *  Create Kafka Producer
   */
  producer(): Producer {
    try {
      const producer = this.kafka.producer({ allowAutoTopicCreation: true });
      return producer;
    } catch (error) {
      console.log(error);
    }
  }
}
