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
exports.FacilityController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_facility_dto_1 = require("./dtos/create.facility.dto");
const update_facility_dto_1 = require("./dtos/update.facility.dto");
const facility_service_1 = require("./facility.service");
const nest_keycloak_connect_1 = require("nest-keycloak-connect");
const pagination_dto_1 = require("../common/commonDto/pagination.dto");
const nestjs_i18n_1 = require("nestjs-i18n");
let FacilityController = class FacilityController {
    constructor(facilityService, i18n) {
        this.facilityService = facilityService;
        this.i18n = i18n;
    }
    async getAllFacilities(query, i18n) {
        return this.facilityService.findAll(query);
    }
    getFacility(id) {
        return this.facilityService.findOne(id);
    }
    createFacility(createFacilityDto) {
        return this.facilityService.create(createFacilityDto);
    }
    updateFacility(id, updateFacilityDto) {
        return this.facilityService.update(id, updateFacilityDto);
    }
    deleteFacility(id) {
        return this.facilityService.remove(id);
    }
    async createFacilitiesByExcel(res) {
        const xlsxFile = require("read-excel-file/node");
        const facilityRows = await xlsxFile("./uploads/data.xlsx").then((rows) => {
            return rows;
        });
        const createdFacilitiesCount = await this.facilityService.createAll(facilityRows);
        console.log("*********************************" + facilityRows);
        return res.send("createdFacilitiesCount = " + createdFacilitiesCount);
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "Gets all facilities ",
        description: "If you want to get all facilities in your organization use this route. It takes no path or query params",
    }),
    (0, common_1.Get)("/"),
    (0, nest_keycloak_connect_1.Unprotected)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, nestjs_i18n_1.I18n)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationParams,
        nestjs_i18n_1.I18nContext]),
    __metadata("design:returntype", Promise)
], FacilityController.prototype, "getAllFacilities", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "Gets facility with id ",
        description: "If you want to get specific facility in your organization use this route. It takes  query params which is  id",
    }),
    (0, common_1.Get)("/:_id"),
    (0, nest_keycloak_connect_1.Unprotected)(),
    __param(0, (0, common_1.Param)("_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FacilityController.prototype, "getFacility", null);
__decorate([
    (0, swagger_1.ApiBody)({
        type: create_facility_dto_1.CreateFacilityDto,
        description: "Store product structure",
    }),
    (0, common_1.Post)(""),
    (0, nest_keycloak_connect_1.Unprotected)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_facility_dto_1.CreateFacilityDto]),
    __metadata("design:returntype", Promise)
], FacilityController.prototype, "createFacility", null);
__decorate([
    (0, swagger_1.ApiBody)({
        type: update_facility_dto_1.UpdateFacilityDto,
        description: "update  facility structure",
    }),
    (0, common_1.Patch)("/:_id"),
    (0, nest_keycloak_connect_1.Unprotected)(),
    __param(0, (0, common_1.Param)("_id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_facility_dto_1.UpdateFacilityDto]),
    __metadata("design:returntype", void 0)
], FacilityController.prototype, "updateFacility", null);
__decorate([
    (0, common_1.Delete)("/:_id"),
    __param(0, (0, common_1.Param)("_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FacilityController.prototype, "deleteFacility", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "Load facility excel file ",
        description: "***",
    }),
    (0, nest_keycloak_connect_1.Unprotected)(),
    (0, common_1.Post)("createfacilities"),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FacilityController.prototype, "createFacilitiesByExcel", null);
FacilityController = __decorate([
    (0, swagger_1.ApiTags)("Facility"),
    (0, common_1.Controller)("facility"),
    __metadata("design:paramtypes", [facility_service_1.FacilityService,
        nestjs_i18n_1.I18nService])
], FacilityController);
exports.FacilityController = FacilityController;
//# sourceMappingURL=facility.controller.js.map