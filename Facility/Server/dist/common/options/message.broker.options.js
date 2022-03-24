"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kafkaOptions = void 0;
const microservices_1 = require("@nestjs/microservices");
exports.kafkaOptions = {
    transport: microservices_1.Transport.KAFKA,
    options: {
        client: {
            brokers: [process.env.KAFKA_BROKER],
            clientId: process.env.KAFKA_CLIENT_ID,
        },
        consumer: {
            groupId: process.env.KAFKA_CONSUMER_GROUP_ID,
        },
        producer: {
            allowAutoTopicCreation: false,
        },
        subscribe: {
            fromBeginning: false,
        },
    },
};
//# sourceMappingURL=message.broker.options.js.map