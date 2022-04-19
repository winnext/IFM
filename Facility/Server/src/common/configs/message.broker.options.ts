import { KafkaOptions, Transport } from '@nestjs/microservices';

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
    },
    subscribe: {
      fromBeginning: false,
    },
  },
};
