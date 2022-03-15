"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppLoggerMiddleware = void 0;
const common_1 = require("@nestjs/common");
const kafta_topic_enum_1 = require("../const/kafta.topic.enum");
const kafkaService_1 = require("../queueService/kafkaService");
const post_kafka_1 = require("../queueService/post-kafka");
let AppLoggerMiddleware = class AppLoggerMiddleware {
    constructor() {
        this.logger = new common_1.Logger("HTTP");
        this.postKafka = new post_kafka_1.PostKafka(new kafkaService_1.KafkaService());
    }
    use(request, response, next) {
        const { ip, method, path: url } = request;
        const userAgent = request.get("user-agent") || "";
        const query = request.params;
        const requestInformation = {
            timestamp: new Date(),
            path: request.url,
            method: request.method,
            body: request.body,
            userToken: request.headers["authorization"] || null,
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
        next();
    }
};
AppLoggerMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AppLoggerMiddleware);
exports.AppLoggerMiddleware = AppLoggerMiddleware;
//# sourceMappingURL=apploggermiddleware.js.map