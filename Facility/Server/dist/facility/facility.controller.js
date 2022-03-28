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
const multer_1 = require("multer");
const platform_express_1 = require("@nestjs/platform-express");
const keycloak_role_enum_1 = require("../common/const/keycloak.role.enum");
let FacilityController = class FacilityController {
    constructor(facilityService) {
        this.facilityService = facilityService;
    }
    async getAllFacilities(params) {
        return this.facilityService.findAll(params);
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
    async createFacilitiesByCsv(res, file) {
        return res.send(await this.facilityService.createAll(file));
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Gets all facilities ',
        description: 'If you want to get all facilities in your organization use this route. It takes no path or query params',
    }),
    (0, common_1.Get)('/'),
    (0, nest_keycloak_connect_1.Roles)({ roles: [keycloak_role_enum_1.FacilityUserRoles.ADMIN] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationParams]),
    __metadata("design:returntype", Promise)
], FacilityController.prototype, "getAllFacilities", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Gets facility with id ',
        description: 'If you want to get specific facility in your organization use this route. It takes  query params which is  id',
    }),
    (0, common_1.Get)('/:_id'),
    (0, nest_keycloak_connect_1.Roles)({ roles: [keycloak_role_enum_1.FacilityUserRoles.ADMIN] }),
    __param(0, (0, common_1.Param)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FacilityController.prototype, "getFacility", null);
__decorate([
    (0, swagger_1.ApiBody)({
        type: create_facility_dto_1.CreateFacilityDto,
        description: 'Store product structure',
    }),
    (0, common_1.Post)(''),
    (0, nest_keycloak_connect_1.Roles)({ roles: [keycloak_role_enum_1.FacilityUserRoles.ADMIN] }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_facility_dto_1.CreateFacilityDto]),
    __metadata("design:returntype", Promise)
], FacilityController.prototype, "createFacility", null);
__decorate([
    (0, swagger_1.ApiBody)({
        type: update_facility_dto_1.UpdateFacilityDto,
        description: 'update  facility structure',
    }),
    (0, common_1.Patch)('/:_id'),
    (0, nest_keycloak_connect_1.Roles)({ roles: [keycloak_role_enum_1.FacilityUserRoles.ADMIN] }),
    __param(0, (0, common_1.Param)('_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_facility_dto_1.UpdateFacilityDto]),
    __metadata("design:returntype", void 0)
], FacilityController.prototype, "updateFacility", null);
__decorate([
    (0, common_1.Delete)('/:_id'),
    (0, nest_keycloak_connect_1.Roles)({ roles: [keycloak_role_enum_1.FacilityUserRoles.ADMIN] }),
    __param(0, (0, common_1.Param)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FacilityController.prototype, "deleteFacility", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Load facility cs file ',
        description: '***',
    }),
    (0, nest_keycloak_connect_1.Roles)({ roles: [keycloak_role_enum_1.FacilityUserRoles.ADMIN] }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, nest_keycloak_connect_1.Roles)({ roles: [keycloak_role_enum_1.FacilityUserRoles.ADMIN] }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, common_1.Post)('createfacilities'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({ destination: './upload' }),
    })),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FacilityController.prototype, "createFacilitiesByCsv", null);
FacilityController = __decorate([
    (0, swagger_1.ApiTags)('Facility'),
    (0, common_1.Controller)('facility'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [facility_service_1.FacilityService])
], FacilityController);
exports.FacilityController = FacilityController;
//# sourceMappingURL=facility.controller.js.map