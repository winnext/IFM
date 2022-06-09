import { KafkaConfig } from 'kafkajs';

export const kafkaConf: KafkaConfig = {
  brokers: [process.env.KAFKA_BROKER],
  clientId: process.env.KAFKA_CLIENT,
};
