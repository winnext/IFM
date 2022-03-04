"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassificationModule = void 0;
const common_1 = require("@nestjs/common");
const classification_service_1 = require("./classification.service");
const classification_controller_1 = require("./classification.controller");
const classification_entity_1 = require("./entities/classification.entity");
const mongoose_1 = require("@nestjs/mongoose");
const connection_enum_1 = require("../common/const/connection.enum");
const classification_repository_1 = require("./repositories/classification.repository");
const repository_enum_1 = require("../common/const/repository.enum");
let ClassificationModule = class ClassificationModule {
};
ClassificationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                {
                    name: classification_entity_1.Classification.name,
                    schema: classification_entity_1.ClassificationSchema,
                },
            ], connection_enum_1.ConnectionEnums.CLASSIFICATION),
        ],
        controllers: [classification_controller_1.ClassificationController],
        providers: [
            classification_service_1.ClassificationService,
            {
                provide: repository_enum_1.RepositoryEnums.CLASSIFICATION,
                useClass: classification_repository_1.ClassificationRepository,
            },
        ],
    })
], ClassificationModule);
exports.ClassificationModule = ClassificationModule;
//# sourceMappingURL=classification.module.js.map