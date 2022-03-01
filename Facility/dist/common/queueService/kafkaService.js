"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaService = void 0;
const kafkajs_1 = require("kafkajs");
class KafkaService {
    constructor() {
        this.kafka = new kafkajs_1.Kafka({
            clientId: "kafka_ornek_1",
            brokers: ["172.19.100.120:9092"],
        });
    }
    producer() {
        const producer = this.kafka.producer({ allowAutoTopicCreation: true });
        return producer;
    }
}
exports.KafkaService = KafkaService;
//# sourceMappingURL=kafkaService.js.map