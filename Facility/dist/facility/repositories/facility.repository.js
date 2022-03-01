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
exports.FacilityRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const exception_filter_1 = require("../../common/exceptionFilters/exception.filter");
const facility_entity_1 = require("../entities/facility.entity");
let FacilityRepository = class FacilityRepository {
    constructor(facilityModel) {
        this.facilityModel = facilityModel;
    }
    remove(id) {
        throw new Error('Method not implemented.');
    }
    findWithRelations(relations) {
        throw new Error('Method not implemented.');
    }
    async findOneById(_id) {
        try {
            const facility = await this.facilityModel.findById({ _id }).exec();
            if (!facility) {
                throw new common_1.BadRequestException(_id);
            }
            return facility;
        }
        catch (err) {
            console.log(err);
        }
    }
    async findAll() {
        return await this.facilityModel.find().exec();
    }
    async create(createFacilityDto) {
        const facility = new this.facilityModel(createFacilityDto);
        return await facility.save();
    }
    update() {
        throw new Error('Method not implemented.');
    }
    delete() {
        throw new Error('Method not implemented.');
    }
};
FacilityRepository = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.UseFilters)(new exception_filter_1.HttpExceptionFilter()),
    __param(0, (0, mongoose_1.InjectModel)(facility_entity_1.Facility.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], FacilityRepository);
exports.FacilityRepository = FacilityRepository;
//# sourceMappingURL=facility.repository.js.map