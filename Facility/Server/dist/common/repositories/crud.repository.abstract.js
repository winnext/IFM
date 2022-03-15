"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAbstractRepository = void 0;
const common_1 = require("@nestjs/common");
class BaseAbstractRepository {
    constructor(entity) {
        this.entity = entity;
    }
    update(_id, data) {
        throw new Error('Method not implemented.');
    }
    delete(_id) {
        throw new Error('Method not implemented.');
    }
    async create(data) {
        return await this.entity.create(data);
    }
    async findOneById(id) {
        const test = await this.entity.findOne({ _id: id });
        if (!test) {
            throw new common_1.NotFoundException('Not found');
        }
        return await this.entity.findOne({ _id: id });
    }
    async findWithRelations(relations) {
        return await this.entity.find(relations);
    }
    async findAll() {
        return await this.entity.find();
    }
    async remove(id) {
        return await this.entity.findByIdAndDelete(id);
    }
}
exports.BaseAbstractRepository = BaseAbstractRepository;
//# sourceMappingURL=crud.repository.abstract.js.map