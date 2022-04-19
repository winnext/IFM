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
exports.ClassificationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const nest_keycloak_connect_1 = require("nest-keycloak-connect");
const pagination_dto_1 = require("../common/commonDto/pagination.dto");
const keycloak_role_enum_1 = require("../common/const/keycloak.role.enum");
const http_cache_interceptor_1 = require("../common/interceptors/http.cache.interceptor");
const classification_service_1 = require("./classification.service");
const create_classification_dto_1 = require("./dto/create-classification.dto");
const update_classification_dto_1 = require("./dto/update-classification.dto");
let ClassificationController = class ClassificationController {
    constructor(classificationService) {
        this.classificationService = classificationService;
    }
    create(createClassificationDto) {
        return this.classificationService.create(createClassificationDto);
    }
    findAll(paramDto) {
        return this.classificationService.findAll(paramDto);
    }
    findOne(id) {
        return this.classificationService.findOne(id);
    }
    update(id, updateClassificationDto) {
        return this.classificationService.update(id, updateClassificationDto);
    }
    remove(id) {
        return this.classificationService.remove(id);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, nest_keycloak_connect_1.Roles)({ roles: [keycloak_role_enum_1.UserRoles.ADMIN] }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_classification_dto_1.CreateClassificationDto]),
    __metadata("design:returntype", void 0)
], ClassificationController.prototype, "create", null);
__decorate([
    (0, nest_keycloak_connect_1.Unprotected)(),
    (0, common_1.Get)(),
    (0, http_cache_interceptor_1.NoCache)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationParams]),
    __metadata("design:returntype", void 0)
], ClassificationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClassificationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_classification_dto_1.UpdateClassificationDto]),
    __metadata("design:returntype", void 0)
], ClassificationController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClassificationController.prototype, "remove", null);
ClassificationController = __decorate([
    (0, swagger_1.ApiTags)('Classification'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('classification'),
    __metadata("design:paramtypes", [classification_service_1.ClassificationService])
], ClassificationController);
exports.ClassificationController = ClassificationController;
//# sourceMappingURL=classification.controller.js.map