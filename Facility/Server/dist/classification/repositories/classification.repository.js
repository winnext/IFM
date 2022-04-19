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
exports.ClassificationRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const not_found_exception_1 = require("../../common/notFoundExceptions/not.found.exception");
const classification_entity_1 = require("../entities/classification.entity");
let ClassificationRepository = class ClassificationRepository {
    constructor(classificationModel) {
        this.classificationModel = classificationModel;
    }
    findWithRelations(relations) {
        throw new Error(relations);
    }
    async findOneById(id) {
        const classification = await this.classificationModel.findById({ _id: id }).exec();
        if (!classification) {
            throw new not_found_exception_1.ClassificationNotFountException(id);
        }
        return classification;
    }
    async findAll(data) {
        let { page, limit, orderBy, orderByColumn } = data;
        page = page || 0;
        limit = limit || 5;
        orderBy = orderBy || 'ascending';
        orderByColumn = orderByColumn || 'name';
        const count = parseInt((await this.classificationModel.find().count()).toString());
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
        const result = await this.classificationModel
            .find()
            .skip(skip)
            .limit(lmt)
            .sort([[orderByColumn, orderBy]])
            .exec();
        const pagination = { count: count, page: pg, limit: lmt };
        const classification = [];
        classification.push(result);
        classification.push(pagination);
        return classification;
    }
    async create(createClassificationDto) {
        const classification = new this.classificationModel(createClassificationDto);
        return await classification.save();
    }
    async update(_id, updateClassificationto) {
        const updatedFacility = await this.classificationModel
            .findOneAndUpdate({ _id }, { $set: updateClassificationto }, { new: true })
            .exec();
        if (!updatedFacility) {
            throw new not_found_exception_1.ClassificationNotFountException(_id);
        }
        return updatedFacility;
    }
    async delete(_id) {
        const classification = await this.findOneById(_id);
        return this.classificationModel.remove(classification);
    }
};
ClassificationRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(classification_entity_1.Classification.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ClassificationRepository);
exports.ClassificationRepository = ClassificationRepository;
//# sourceMappingURL=classification.repository.js.map