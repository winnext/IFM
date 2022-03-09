"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaService = void 0;
const kafkajs_1 = require("kafkajs");
class KafkaService {
    constructor() {
        this.kafka = new kafkajs_1.Kafka({
            clientId: process.env.KAFKA_CLIENT_ID,
            brokers: [process.env.KAFKA_BROKER],
        });
    }
    producer() {
        try {
            const producer = this.kafka.producer({ allowAutoTopicCreation: false });
            return producer;
        }
        catch (error) {
            console.log(error);
        }
    }
}
exports.KafkaService = KafkaService;
//# sourceMappingURL=kafkaService.js.map