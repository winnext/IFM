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
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const facility_entity_1 = require("./entities/facility.entity");
const facility_repository_1 = require("./repositories/facility.repository");
let FacilityService = class FacilityService {
    constructor(facilityRepository, facilityModel) {
        this.facilityRepository = facilityRepository;
        this.facilityModel = facilityModel;
    }
    findAll() {
        return this.facilityRepository.findAll();
    }
    async findOne(_id) {
        return this.facilityRepository.findOneById(_id);
    }
    create(createFacilityDto) {
        return this.facilityRepository.create(createFacilityDto);
    }
    async remove(id) {
        const facility = await this.findOne(id);
        return facility.remove();
    }
};
FacilityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('FacilityRepositoryInterface')),
    __param(1, (0, mongoose_1.InjectModel)(facility_entity_1.Facility.name)),
    __metadata("design:paramtypes", [facility_repository_1.FacilityRepository,
        mongoose_2.Model])
], FacilityService);
exports.FacilityService = FacilityService;
//# sourceMappingURL=facility.service.js.map