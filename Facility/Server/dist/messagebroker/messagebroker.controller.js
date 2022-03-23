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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagebrokerController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const nest_keycloak_connect_1 = require("nest-keycloak-connect");
const path_enum_1 = require("../common/const/path.enum");
const kafta_topic_enum_1 = require("../common/const/kafta.topic.enum");
const classification_history_service_1 = require("../history/classification.history.service");
const facility_history_service_1 = require("../history/facility.history.service");
let MessagebrokerController = class MessagebrokerController {
    constructor(facilityHistoryService, classificationHistoryService, cacheManager) {
        this.facilityHistoryService = facilityHistoryService;
        this.classificationHistoryService = classificationHistoryService;
        this.cacheManager = cacheManager;
    }
    exceptionListener(message) {
        console.log('this is from message broker exception listener' + message.value);
    }
    loggerListener(message) {
        console.log('this is from message broker logger listener' + message.value);
    }
    async operationListener(message) {
        switch (message.key) {
            case path_enum_1.PathEnums.FACILITY:
                await this.cacheManager.del(path_enum_1.PathEnums.FACILITY, () => console.log('clear facility cache is done'));
                const facilityHistory = { facility: message.value.responseBody, user: message.value.user };
                await this.facilityHistoryService.create(facilityHistory);
                break;
            case path_enum_1.PathEnums.CLASSIFICATION:
                await this.cacheManager.del(path_enum_1.PathEnums.CLASSIFICATION, () => console.log('clear classification cache is done'));
                const classificationHistory = { classification: message.value.responseBody, user: message.value.user };
                await this.classificationHistoryService.create(classificationHistory);
                break;
            default:
                console.log('undefined history call from facility microservice');
                break;
        }
    }
};
__decorate([
    (0, microservices_1.MessagePattern)(kafta_topic_enum_1.FacilityTopics.FACILITY_EXCEPTIONS),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], MessagebrokerController.prototype, "exceptionListener", null);
__decorate([
    (0, microservices_1.MessagePattern)(kafta_topic_enum_1.FacilityTopics.FACILITY_LOGGER),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], MessagebrokerController.prototype, "loggerListener", null);
__decorate([
    (0, microservices_1.EventPattern)(kafta_topic_enum_1.FacilityTopics.FACILITY_OPERATION),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessagebrokerController.prototype, "operationListener", null);
MessagebrokerController = __decorate([
    (0, common_1.Controller)('messagebroker'),
    (0, nest_keycloak_connect_1.Unprotected)(),
    __param(2, (0, common_1.Inject)(common_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [facility_history_service_1.FacilityHistoryService,
        classification_history_service_1.ClassificationHistoryService, Object])
], MessagebrokerController);
exports.MessagebrokerController = MessagebrokerController;
//# sourceMappingURL=messagebroker.controller.js.map