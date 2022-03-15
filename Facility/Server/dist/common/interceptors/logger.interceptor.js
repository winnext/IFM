"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingInterceptor = exports.LoggerInter = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const kafta_topic_enum_1 = require("../const/kafta.topic.enum");
const objectId_check_1 = require("../func/objectId.check");
const kafkaService_1 = require("../queueService/kafkaService");
const post_kafka_1 = require("../queueService/post-kafka");
function LoggerInter() {
    return (0, common_1.UseInterceptors)(new LoggingInterceptor());
}
exports.LoggerInter = LoggerInter;
class LoggingInterceptor {
    constructor() {
        this.logger = new common_1.Logger("HTTP");
        this.postKafka = new post_kafka_1.PostKafka(new kafkaService_1.KafkaService());
    }
    async intercept(context, next) {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        const query = request.params;
        const requestInformation = {
            timestamp: new Date(),
            path: request.url,
            method: request.method,
            body: request.body,
            user: request.user || null
        };
        const now = Date.now();
        response.on("close", async () => {
            const { statusCode, statusMessage } = response;
            const responseInformation = {
                statusCode,
                statusMessage,
                responseTime: `${Date.now() - now} ms`,
            };
            const log = { requestInformation, responseInformation };
            try {
                await this.postKafka.producerSendMessage(kafta_topic_enum_1.FacilityTopics.FACILITY_LOGGER, JSON.stringify(log));
                console.log("FACILITY_LOGGER topic send succesful");
            }
            catch (error) {
                console.log("FACILITY_LOGGER topic cannot connected due to " + error);
            }
            this.logger.log(`${JSON.stringify(log)}   `);
        });
        if (query._id) {
            (0, objectId_check_1.checkObjectIddİsValid)(query._id);
        }
        return next.handle().pipe((0, operators_1.tap)());
    }
}
exports.LoggingInterceptor = LoggingInterceptor;
//# sourceMappingURL=logger.interceptor.js.map