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
exports.HttpExceptionFilter = void 0;
const nestjs_i18n_1 = require("nestjs-i18n");
const common_1 = require("@nestjs/common");
const i18n_enum_1 = require("../const/i18n.enum");
const kafkaService_1 = require("../queueService/kafkaService");
const post_kafka_1 = require("../queueService/post-kafka");
const kafta_topic_enum_1 = require("../const/kafta.topic.enum");
let HttpExceptionFilter = class HttpExceptionFilter {
    constructor(i18n) {
        this.i18n = i18n;
        this.postKafka = new post_kafka_1.PostKafka(new kafkaService_1.KafkaService());
    }
    async catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const errorResponseLog = {
            timestamp: new Date().toLocaleDateString(),
            path: request.url,
            method: request.method,
        };
        switch (exception.getStatus()) {
            case 401:
                try {
                    const message = await this.i18n.translate(i18n_enum_1.I18NEnums.USER_NOT_HAVE_PERMISSION, {
                        lang: ctx.getRequest().i18nLang,
                        args: { username: "Test User" },
                    });
                    const clientResponse = { status: status, message };
                    await this.postKafka.producerSendMessage(kafta_topic_enum_1.FacilityTopics.FACILITY_EXCEPTIONS, JSON.stringify(Object.assign(Object.assign({}, errorResponseLog), clientResponse)));
                    response.status(status).json(clientResponse);
                }
                catch (error) {
                    console.log("FACILITY_EXCEPTION topic cannot connected due to " + error);
                }
                break;
            case 404:
                let result = exception.getResponse();
                try {
                    result = await this.i18n.translate(result.key, {
                        lang: ctx.getRequest().i18nLang,
                        args: result.args,
                    });
                    const clientResponse = { status: status, result };
                    await this.postKafka.producerSendMessage(kafta_topic_enum_1.FacilityTopics.FACILITY_EXCEPTIONS, JSON.stringify(Object.assign(Object.assign({}, errorResponseLog), clientResponse)));
                    console.log(`FACILITY_EXCEPTION sending to topic`);
                }
                catch (error) {
                    console.log(error);
                }
                typeof result === "string"
                    ? response.status(status).json({ status: status, message: result })
                    : response.status(status).json({ status, message: result.message });
                break;
            default:
                break;
        }
    }
};
HttpExceptionFilter = __decorate([
    (0, common_1.Catch)(common_1.HttpException),
    __metadata("design:paramtypes", [nestjs_i18n_1.I18nService])
], HttpExceptionFilter);
exports.HttpExceptionFilter = HttpExceptionFilter;
//# sourceMappingURL=exception.filter.js.map