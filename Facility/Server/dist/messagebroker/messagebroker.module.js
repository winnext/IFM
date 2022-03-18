"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagebrokerModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const connection_enum_1 = require("../common/const/connection.enum");
const repository_enum_1 = require("../common/const/repository.enum");
const facility_history_entity_1 = require("./entities/facility.history.entity");
const messagebroker_controller_1 = require("./messagebroker.controller");
const facility_historry_service_1 = require("./facility.historry.service");
const facility_history_repository_1 = require("./repositories/facility.history.repository");
const classification_history_entity_1 = require("./entities/classification.history.entity");
const classification_history_repository_1 = require("./repositories/classification.history.repository");
const classification_historyservice_1 = require("./classification.historyservice");
let MessagebrokerModule = class MessagebrokerModule {
};
MessagebrokerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                {
                    name: facility_history_entity_1.FacilityHistory.name,
                    schema: facility_history_entity_1.FaciliyHistorySchema,
                },
                {
                    name: classification_history_entity_1.ClassificationHistory.name,
                    schema: classification_history_entity_1.ClassificationHistorySchema,
                },
            ], connection_enum_1.ConnectionEnums.FACILITY),
        ],
        controllers: [messagebroker_controller_1.MessagebrokerController],
        providers: [
            facility_historry_service_1.FacilityHistoryService,
            classification_historyservice_1.ClassificationHistoryService,
            {
                provide: repository_enum_1.RepositoryEnums.FACILITY_HISTORY,
                useClass: facility_history_repository_1.FacilityHistoryRepository,
            },
            {
                provide: repository_enum_1.RepositoryEnums.CLASSIFICATION_HISTORY,
                useClass: classification_history_repository_1.ClassificationHistoryRepository,
            },
        ],
    })
], MessagebrokerModule);
exports.MessagebrokerModule = MessagebrokerModule;
//# sourceMappingURL=messagebroker.module.js.map