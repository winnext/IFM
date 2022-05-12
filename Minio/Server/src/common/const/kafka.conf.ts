import { KafkaConfig } from 'kafkajs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export const kafkaConf: KafkaConfig = {
  brokers: [process.env.KAFKA_BROKER],
  clientId: process.env.KAFKA_CLIENT,
};
