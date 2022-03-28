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
exports.FacilityService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const pagination_dto_1 = require("../common/commonDto/pagination.dto");
const repository_enum_1 = require("../common/const/repository.enum");
const objectId_check_1 = require("../common/func/objectId.check");
const create_facility_dto_1 = require("./dtos/create.facility.dto");
const update_facility_dto_1 = require("./dtos/update.facility.dto");
const nestjs_otel_1 = require("nestjs-otel");
let FacilityService = class FacilityService {
    constructor(facilityRepository) {
        this.facilityRepository = facilityRepository;
    }
    findAll(query) {
        return this.facilityRepository.findAll(query);
    }
    async findOne(id) {
        return this.facilityRepository.findOneById(id);
    }
    create(createFacilityDto) {
        return this.facilityRepository.create(createFacilityDto);
    }
    async update(id, updateFacilityDto) {
        (0, objectId_check_1.checkObjectIddİsValid)(id);
        return this.facilityRepository.update(id, updateFacilityDto);
    }
    async remove(id) {
        const facility = await this.findOne(id);
        return facility.remove();
    }
    async createAll(file) {
        const fs = require('fs');
        const csv = require('csv-parser');
        try {
            fs;
            (0, fs_1.createReadStream)(file.path)
                .pipe(csv())
                .on('data', (data) => {
                const dto = {
                    facility_name: data.facility_name,
                    locations: data.locations,
                    brand_name: data.brand_name,
                    type_of_facility: data.type_of_facility,
                    classification_of_facility: data.classification_of_facility,
                    label: data.facility_name,
                    country: data.label,
                    city: data.city,
                    address: data.address,
                };
                this.facilityRepository.create(dto);
            });
            return 'success';
        }
        catch (_a) {
            return 'failed';
        }
    }
};
__decorate([
    (0, nestjs_otel_1.Span)('find all Facilities'),
    (0, nestjs_otel_1.OtelMethodCounter)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationParams]),
    __metadata("design:returntype", Promise)
], FacilityService.prototype, "findAll", null);
__decorate([
    (0, nestjs_otel_1.Span)('find a facility by id'),
    (0, nestjs_otel_1.OtelMethodCounter)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FacilityService.prototype, "findOne", null);
__decorate([
    (0, nestjs_otel_1.Span)('create a facility'),
    (0, nestjs_otel_1.OtelMethodCounter)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_facility_dto_1.CreateFacilityDto]),
    __metadata("design:returntype", Promise)
], FacilityService.prototype, "create", null);
__decorate([
    (0, nestjs_otel_1.Span)('update a facility'),
    (0, nestjs_otel_1.OtelMethodCounter)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_facility_dto_1.UpdateFacilityDto]),
    __metadata("design:returntype", Promise)
], FacilityService.prototype, "update", null);
__decorate([
    (0, nestjs_otel_1.Span)('remove a facility'),
    (0, nestjs_otel_1.OtelMethodCounter)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FacilityService.prototype, "remove", null);
__decorate([
    (0, nestjs_otel_1.Span)('create many facilities with file'),
    (0, nestjs_otel_1.OtelMethodCounter)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FacilityService.prototype, "createAll", null);
FacilityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(repository_enum_1.RepositoryEnums.FACILITY)),
    __metadata("design:paramtypes", [Object])
], FacilityService);
exports.FacilityService = FacilityService;
//# sourceMappingURL=facility.service.js.map