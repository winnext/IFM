import { ConfigService } from "@nestjs/config";
import { Kafka, Producer } from "kafkajs";
import { IQueueService } from "./queueInterface";
export declare class KafkaService implements IQueueService {
    configService: ConfigService;
    kafka: Kafka;
    producer(): Producer;
}
