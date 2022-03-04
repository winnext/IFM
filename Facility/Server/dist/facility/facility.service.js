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
const repository_enum_1 = require("../common/const/repository.enum");
const objectId_check_1 = require("../common/func/objectId.check");
let FacilityService = class FacilityService {
    constructor(facilityRepository) {
        this.facilityRepository = facilityRepository;
    }
    findAll(query) {
        const { skip, limit } = query;
        return this.facilityRepository.findAll(skip, limit);
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
};
FacilityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(repository_enum_1.RepositoryEnums.FACILITY)),
    __metadata("design:paramtypes", [Object])
], FacilityService);
exports.FacilityService = FacilityService;
//# sourceMappingURL=facility.service.js.map