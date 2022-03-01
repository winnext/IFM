"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const facility_module_1 = require("./facility/facility.module");
const config_1 = require("@nestjs/config");
const keyclock_module_1 = require("./facility/keyclock.module");
const classification_module_1 = require("./classification/classification.module");
const connection_enum_1 = require("./common/const/connection.enum");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            facility_module_1.FacilityModule, keyclock_module_1.KeycloakModule,
            mongoose_1.MongooseModule.forRootAsync({
                connectionName: connection_enum_1.ConnectionEnums.FACILITY,
                useFactory: (config) => ({
                    uri: config.get("DATABASE_LINK"),
                    dbName: config.get("FACILITY_DB_NAME"),
                    user: config.get("DB_USER"),
                    pass: config.get("DB_PASS"),
                }),
                inject: [config_1.ConfigService],
            }),
            mongoose_1.MongooseModule.forRootAsync({
                connectionName: connection_enum_1.ConnectionEnums.CLASSIFICATION,
                useFactory: (config) => ({
                    uri: config.get("DATABASE_LINK"),
                    dbName: config.get("CLASSIFICATION_DB_NAME"),
                    user: config.get("DB_USER"),
                    pass: config.get("DB_PASS"),
                }),
                inject: [config_1.ConfigService],
            }),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            classification_module_1.ClassificationModule,
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map