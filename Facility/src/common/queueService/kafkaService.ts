import { Kafka, Producer } from "kafkajs";
import { IQueueService } from "./queueInterface";

export class KafkaService implements IQueueService {
  kafka = new Kafka({
    clientId: "kafka_ornek_1",
    brokers: ["172.19.100.120:9092"],
  });

  producer(): Producer {
    const producer = this.kafka.producer({ allowAutoTopicCreation: true });

    return producer;
  }
}
