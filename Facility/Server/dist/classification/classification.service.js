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
exports.ClassificationService = void 0;
const common_1 = require("@nestjs/common");
const repository_enum_1 = require("../common/const/repository.enum");
const objectId_check_1 = require("../common/func/objectId.check");
const facility_not_found_exception_1 = require("../common/notFoundExceptions/facility.not.found.exception");
let ClassificationService = class ClassificationService {
    constructor(classificationRepository) {
        this.classificationRepository = classificationRepository;
    }
    async create(createClassificationDto) {
        return await this.classificationRepository.create(createClassificationDto);
    }
    async findAll(query) {
        return await this.classificationRepository.findAll(query);
    }
    async findOne(id) {
        (0, objectId_check_1.checkObjectIddİsValid)(id);
        return await this.classificationRepository.findOneById(id);
    }
    async update(id, updateClassificationDto) {
        (0, objectId_check_1.checkObjectIddİsValid)(id);
        return await this.classificationRepository.update(id, updateClassificationDto);
    }
    async remove(id) {
        const classification = await this.findOne(id);
        if (!classification) {
            throw new facility_not_found_exception_1.ClassificationNotFountException(id);
        }
        return await classification.remove();
    }
};
ClassificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(repository_enum_1.RepositoryEnums.CLASSIFICATION)),
    __metadata("design:paramtypes", [Object])
], ClassificationService);
exports.ClassificationService = ClassificationService;
//# sourceMappingURL=classification.service.js.map