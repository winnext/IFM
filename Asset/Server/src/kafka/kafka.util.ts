import { Kafka, KafkaConfig } from 'kafkajs';

export const createProducer = async (config: KafkaConfig) => {
  const kafka = new Kafka(config);

  const producer = kafka.producer({ allowAutoTopicCreation: true });

  return producer;
};
