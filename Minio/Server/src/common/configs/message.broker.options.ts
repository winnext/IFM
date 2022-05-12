import { KafkaOptions, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';

/**
 * Kafka Options
 */
export const kafkaOptions: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      brokers: [process.env.KAFKA_BROKER],
      clientId: process.env.KAFKA_CLIENT_ID,
    },
    consumer: {
      groupId: process.env.KAFKA_CONSUMER_GROUP_ID,
    },
    producer: {
      allowAutoTopicCreation: false,
      createPartitioner: Partitioners.LegacyPartitioner,
    },
    subscribe: {
      fromBeginning: false,
    },
  },
};
