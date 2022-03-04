import { Producer } from "kafkajs";
import { IQueueService } from "./queueInterface";
export declare class PostKafka {
    private service;
    constructor(service: IQueueService);
    producer: Producer;
    producerTest(topicName: string, message: string): Promise<void>;
}
