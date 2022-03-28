"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacilityModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const connection_enum_1 = require("../common/const/connection.enum");
const repository_enum_1 = require("../common/const/repository.enum");
const facility_entity_1 = require("./entities/facility.entity");
const facility_controller_1 = require("./facility.controller");
const facility_service_1 = require("./facility.service");
const facility_repository_1 = require("./repositories/facility.repository");
let FacilityModule = class FacilityModule {
};
FacilityModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                {
                    name: facility_entity_1.Facility.name,
                    schema: facility_entity_1.FaciliySchema,
                },
            ], connection_enum_1.ConnectionEnums.FACILITY),
        ],
        controllers: [facility_controller_1.FacilityController],
        providers: [
            facility_service_1.FacilityService,
            {
                provide: repository_enum_1.RepositoryEnums.FACILITY,
                useClass: facility_repository_1.FacilityRepository,
            },
        ],
    })
], FacilityModule);
exports.FacilityModule = FacilityModule;
//# sourceMappingURL=facility.module.js.map