import { Kafka, Producer } from 'kafkajs';
import { IQueueService } from './queueInterface';
export declare class KafkaService implements IQueueService {
    kafka: Kafka;
    producer(): Producer;
}
