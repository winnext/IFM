import { Producer } from 'kafkajs';
import { IQueueService } from './queueInterface';
export declare class PostKafka {
    private service;
    constructor(service: IQueueService);
    producer: Producer;
    producerSendMessage(topicName: string, message: string, key?: string): Promise<void>;
}
