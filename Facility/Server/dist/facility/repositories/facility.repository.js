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
const objectId_check_1 = require("../../common/func/objectId.check");
const facility_not_found_exception_1 = require("../../common/notFoundExceptions/facility.not.found.exception");
const facility_entity_1 = require("../entities/facility.entity");
let FacilityRepository = class FacilityRepository {
    constructor(facilityModel) {
        this.facilityModel = facilityModel;
    }
    findWithRelations(relations) {
        throw new Error(relations);
    }
    async findOneById(id) {
        const facility = await this.facilityModel.findById({ _id: id }).exec();
        if (!facility) {
            throw new facility_not_found_exception_1.FacilityNotFountException(id);
        }
        return facility;
    }
    async findAll(data) {
        let { page, limit } = data;
        page = page || 0;
        limit = limit || 5;
        const orderBy = data.orderBy || 'ascending';
        const orderByColumn = data.orderByColumn || 'FacilityName';
        const count = parseInt((await this.facilityModel.find().count()).toString());
        const pagecount = Math.ceil(count / limit);
        let pg = parseInt(page.toString());
        const lmt = parseInt(limit.toString());
        if (pg > pagecount) {
            pg = pagecount;
        }
        let skip = pg * lmt;
        if (skip >= count) {
            skip = count - lmt;
            if (skip < 0) {
                skip = 0;
            }
        }
        const result = await this.facilityModel
            .find()
            .skip(skip)
            .limit(lmt)
            .sort([[orderByColumn, orderBy]])
            .exec();
        const pagination = { count: count, page: pg, limit: lmt };
        const facility = [];
        facility.push(result);
        facility.push(pagination);
        return facility;
    }
    async create(createFacilityDto) {
        const { classifications } = createFacilityDto;
        const facility = new this.facilityModel(createFacilityDto);
        return await facility.save();
    }
    async update(_id, updateFacilityDto) {
        const { classifications } = updateFacilityDto;
        (0, objectId_check_1.checkObjectIddİsValid)(classifications.classificationId);
        const updatedFacility = await this.facilityModel
            .findOneAndUpdate({ _id }, { $set: updateFacilityDto }, { new: true })
            .exec();
        if (!updatedFacility) {
            throw new facility_not_found_exception_1.FacilityNotFountException(_id);
        }
        return updatedFacility;
    }
    async delete(_id) {
        const facility = await this.findOneById(_id);
        return this.facilityModel.remove(facility);
    }
};
FacilityRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(facility_entity_1.Facility.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], FacilityRepository);
exports.FacilityRepository = FacilityRepository;
//# sourceMappingURL=facility.repository.js.map