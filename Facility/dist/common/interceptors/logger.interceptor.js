"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingInterceptor = exports.LoggerInter = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const facility_entity_1 = require("../../facility/entities/facility.entity");
const kafkaService_1 = require("../queueService/kafkaService");
const post_kafka_1 = require("../queueService/post-kafka");
function LoggerInter() {
    return (0, common_1.UseInterceptors)(new LoggingInterceptor());
}
exports.LoggerInter = LoggerInter;
class LoggingInterceptor {
    constructor() {
        this.postKafka = new post_kafka_1.PostKafka(new kafkaService_1.KafkaService());
    }
    async onModuleInit() {
        await this.postKafka.producer.connect();
        console.log("connected to producer");
    }
    async intercept(context, next) {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const methodKey = context.getHandler().name;
        const className = context.getClass().name;
        const query = request.params;
        const requestInformation = {
            timestamp: new Date(),
            path: request.url,
            method: request.method,
            body: request.body,
            userToken: request.headers["authorization"] || null,
            methodKey: methodKey,
            className: className,
        };
        try {
            await this.postKafka.producerTest(facility_entity_1.Facility.name, JSON.stringify(requestInformation));
            console.log("message sent to queue");
        }
        catch (error) {
            console.log("something goes wrong error is = " + error);
        }
        const now = Date.now();
        return next
            .handle()
            .pipe((0, operators_1.tap)(() => console.log(`After... ${Date.now() - now}ms` + requestInformation)));
    }
}
exports.LoggingInterceptor = LoggingInterceptor;
//# sourceMappingURL=logger.interceptor.js.map