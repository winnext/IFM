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
const dist_1 = require("nest-neo4j/dist");
const facility_not_found_exception_1 = require("../../common/notFoundExceptions/facility.not.found.exception");
const classification_entity_1 = require("../entities/classification.entity");
let ClassificationRepository = class ClassificationRepository {
    constructor(neo4jService, classificationModel) {
        this.neo4jService = neo4jService;
        this.classificationModel = classificationModel;
    }
    findWithRelations(relations) {
        throw new Error(relations);
    }
    async findOneById(id) {
        let result = await this.neo4jService.read("MATCH p=(n)-[:CHILDREN*]->(m) where id(n)=" + id + " \
      WITH COLLECT(p) AS ps \
      CALL apoc.convert.toTree(ps) yield value \
      RETURN value;");
        var x = result["records"][0]["_fields"][0];
        if (!result) {
            throw new facility_not_found_exception_1.ClassificationNotFountException(id);
        }
        else if (Object.keys(x).length === 0) {
            result = await this.neo4jService.read("MATCH (n) where id(n) = " + id + " return n");
            let o = { "root": result["records"][0]["_fields"] };
            return o;
        }
        else {
            let o = { "root": result["records"][0]["_fields"] };
            return o;
        }
    }
    async getHello() {
        const res = await this.neo4jService.read(`MATCH (c:Omni11)-[r:ChildOf]->(p:Omni11) RETURN p,r,c`);
        const arr = res.records.map((fields) => {
            const parent = fields.get('p');
            const relation = fields.get('r');
            const child = fields.get('c');
            const z = { parent, relation, child };
            return z;
        });
        return arr;
    }
    async findAll(data) {
        let { page, limit, orderBy, orderByColumn } = data;
        page = page || 0;
        limit = limit || 5;
        orderBy = orderBy || 'DESC';
        orderByColumn = orderByColumn || 'name';
        const count = await this.neo4jService.read(`MATCH (c) where c.hasParent = false RETURN count(c)`);
        let coun = count["records"][0]["length"];
        const pagecount = Math.ceil(coun / limit);
        let pg = parseInt(page.toString());
        const lmt = parseInt(limit.toString());
        if (pg > pagecount) {
            pg = pagecount;
        }
        let skip = pg * lmt;
        if (skip >= coun) {
            skip = coun - lmt;
            if (skip < 0) {
                skip = 0;
            }
        }
        const result = await this.neo4jService.read("MATCH (x) where x.hasParent = false return x ORDER BY x." + orderByColumn + " " + orderBy + " SKIP " + skip + " LIMIT " + limit + " ;");
        let arr = [];
        for (let i = 0; i < result["records"].length; i++) {
            arr.push(result["records"][i]["_fields"][0]);
        }
        const pagination = { count: coun, page: pg, limit: lmt };
        const classification = [];
        classification.push(arr);
        classification.push(pagination);
        return classification;
    }
    async create(createClassificationDto) {
        const classification = new classification_entity_1.Classification();
        classification.name = createClassificationDto.name;
        classification.code = createClassificationDto.code;
        classification.label = classification.code + ' . ' + classification.name;
        if (createClassificationDto.key) {
            classification.key = createClassificationDto.key;
        }
        if (createClassificationDto.tag) {
            classification.tag = createClassificationDto.tag;
        }
        if (createClassificationDto.parent_id) {
            let a = "(x:" + createClassificationDto.labelclass + " {name:'" + classification.name +
                "',code:'" + classification.code + "',key:'" + classification.key + "', hasParent:" + classification.hasParent +
                ", tag:" + JSON.stringify(classification.tag) + ",label:'" + classification.label +
                "', createdAt:'" + classification.createdAt + "', updatedAt:'" + classification.updatedAt + "'})";
            a = "match (y:" + createClassificationDto.labelclass + ") where id(y)=" + createClassificationDto.parent_id + " create (y)-[:CHILDREN]->" + a;
            let result = await this.neo4jService.write(a);
            let b = "match (x:" + createClassificationDto.labelclass + " {code: '" + classification.code + "'})" +
                " match (y:" + createClassificationDto.labelclass + ") where id(y)=" + createClassificationDto.parent_id +
                " create (x)-[:CHILD_OF]->(y)";
            result = await this.neo4jService.write(b);
            return new classification_entity_1.Classification;
        }
        else {
            classification.hasParent = false;
            let a = "CREATE (x:" + createClassificationDto.labelclass + " {name:'" +
                classification.name + "',code:'" + classification.code + "',key:'" + classification.key + "', hasParent:" + classification.hasParent +
                ", tag:" + JSON.stringify(classification.tag) + ",label:'" + classification.label +
                "', createdAt:'" + classification.createdAt + "', updatedAt:'" + classification.updatedAt + "'})";
            const result = await this.neo4jService.write(a);
            await this.neo4jService.write("match (x:" + createClassificationDto.labelclass + " {key:'" + classification.key + "'}) set x.self_id = id(x)");
            return new classification_entity_1.Classification;
        }
    }
    async update(_id, updateClassificationto) {
        const updatedFacility = await this.classificationModel
            .findOneAndUpdate({ _id }, { $set: updateClassificationto }, { new: true })
            .exec();
        if (!updatedFacility) {
            throw new facility_not_found_exception_1.ClassificationNotFountException(_id);
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
    __param(1, (0, mongoose_1.InjectModel)(classification_entity_1.Classification.name)),
    __metadata("design:paramtypes", [dist_1.Neo4jService,
        mongoose_2.Model])
], ClassificationRepository);
exports.ClassificationRepository = ClassificationRepository;
//# sourceMappingURL=classification.repository.js.map