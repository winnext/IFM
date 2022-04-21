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
const neo4j_driver_1 = require("neo4j-driver");
const classification_entity_1 = require("../entities/classification.entity");
``;
let ClassificationRepository = class ClassificationRepository {
    constructor(neo4jService, classificationModel) {
        this.neo4jService = neo4jService;
        this.classificationModel = classificationModel;
    }
    findWithRelations(relations) {
        throw new Error(relations);
    }
    async findOneById(id) {
        let idNum = parseInt(id);
        let result = await this.neo4jService.read('MATCH (n)-[:CHILDREN*]->(m) \
      WHERE  id(n) = $idNum  and  NOT (m)-[:CHILDREN]->() \
      WITH n, m \
      ORDER BY n.code, m.code \
      MATCH p=(n)-[:CHILDREN*]->(m) \
      WHERE NOT ()-[:CHILDREN]->(n) \
      WITH COLLECT(p) AS ps \
      CALL apoc.convert.toTree(ps) yield value \
      RETURN value', { idNum });
        console.log(result);
        var x = result['records'][0]['_fields'][0];
        if (!result) {
            throw new facility_not_found_exception_1.ClassificationNotFountException(id);
        }
        else if (Object.keys(x).length === 0) {
            result = await this.neo4jService.read('MATCH (n) where id(n) = $idNum return n', { idNum });
            let o = { root: result['records'][0]['_fields'] };
            return o;
        }
        else {
            let o = { root: result['records'][0]['_fields'] };
            return o;
        }
    }
    async findAll(data) {
        let { page, limit, orderBy, orderByColumn } = data;
        page = page || 0;
        limit = limit || 10;
        orderBy = orderBy || 'DESC';
        orderByColumn = orderByColumn || 'name';
        const count = await this.neo4jService.read(`MATCH (c) where c.hasParent = false RETURN count(c)`);
        let coun = count['records'][0]['length'];
        const pagecount = Math.ceil(coun / limit);
        if (page > pagecount) {
            page = pagecount;
        }
        let skip = page * limit;
        if (skip >= coun) {
            skip = coun - limit;
            if (skip < 0) {
                skip = 0;
            }
        }
        const result = await this.neo4jService.read('MATCH (x) where x.hasParent = false return x ORDER BY x.' + orderByColumn + '$orderBy SKIP $skip LIMIT $limit', { limit: (0, neo4j_driver_1.int)(limit), skip: (0, neo4j_driver_1.int)(skip), orderBy: orderBy, orderByColumn: orderByColumn });
        let arr = [];
        for (let i = 0; i < result['records'].length; i++) {
            arr.push(result['records'][i]['_fields'][0]);
        }
        const pagination = { count: coun, page: page, limit: limit };
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
        classification.labelclass = createClassificationDto.labelclass;
        if (createClassificationDto.key) {
            classification.key = createClassificationDto.key;
        }
        if (createClassificationDto.tag) {
            classification.tag = createClassificationDto.tag;
        }
        if (createClassificationDto.parent_id) {
            let a = `(x: ${createClassificationDto.labelclass} {name: $name,code: $code ,key: $key , hasParent: $hasParent,tag: $tag ,label: $label, \
         labelclass: $labelclass,createdAt: $createdAt , updatedAt: $updatedAt})`;
            a = ` match (y: ${createClassificationDto.labelclass}) where id(y)= $parent_id  create (y)-[:CHILDREN]->` + a;
            let result = await this.neo4jService.write(a, {
                labelclass: createClassificationDto.labelclass,
                name: classification.name,
                code: classification.code,
                key: classification.key,
                hasParent: classification.hasParent,
                tag: classification.tag,
                label: classification.label,
                createdAt: classification.createdAt,
                updatedAt: classification.updatedAt,
                parent_id: (0, neo4j_driver_1.int)(createClassificationDto.parent_id),
            });
            await this.neo4jService.write(`match (x: ${createClassificationDto.labelclass} {key: $key}) set x.self_id = id(x)`, {
                key: classification.key
            });
            let b = `match (x: ${createClassificationDto.labelclass} {code: $code}) \
         match (y: ${createClassificationDto.labelclass}) where id(y)= $parent_id \
         create (x)-[:CHILD_OF]->(y)`;
            result = await this.neo4jService.write(b, {
                code: classification.code,
                parent_id: (0, neo4j_driver_1.int)(createClassificationDto.parent_id)
            });
            return new classification_entity_1.Classification();
        }
        else {
            classification.hasParent = false;
            let name = classification.name;
            let code = classification.code;
            let key = classification.key;
            let hasParent = classification.hasParent;
            let tag = classification.tag;
            let label = classification.label;
            let createdAt = classification.createdAt;
            let updatedAt = classification.updatedAt;
            let labelclass = createClassificationDto.labelclass;
            let a = `CREATE (x:${createClassificationDto.labelclass} {name: \
        $name, code:$code,key:$key, hasParent: $hasParent \
        ,tag: $tag , label: $label, labelclass:$labelclass \
        , createdAt: $createdAt, updatedAt: $updatedAt })`;
            const result = await this.neo4jService.write(a, {
                name,
                code,
                key,
                hasParent,
                tag,
                label,
                createdAt,
                updatedAt,
                labelclass
            });
            await this.neo4jService.write(`match (x:${createClassificationDto.labelclass}  {key: $key}) set x.self_id = id(x)`, {
                key: classification.key
            });
            return new classification_entity_1.Classification();
        }
    }
    async update(_id, updateClassificationto) {
        let res = await this.neo4jService.read('MATCH (p) where id(p)=$id return count(p)', { id: parseInt(_id) });
        if (parseInt(JSON.stringify(res.records[0]['_fields'][0]['low'])) > 0) {
            res = await this.neo4jService.write('MATCH (c) where id(c)=$id set c.code= $code, c.name= $name , c.tag= $tag , c.label= $label', {
                name: updateClassificationto.name,
                code: updateClassificationto.code,
                tag: JSON.stringify(updateClassificationto.tag),
                label: updateClassificationto.code + ' . ' + updateClassificationto.name,
                id: (0, neo4j_driver_1.int)(_id),
            });
            console.log('Node updated ................... ');
            return new classification_entity_1.Classification();
        }
        else {
            console.log('Can not find a node for update  ....................');
            return new classification_entity_1.Classification();
        }
    }
    async delete(_id) {
        let res = await this.neo4jService.read('MATCH (c)  -[r:CHILDREN]->(p) where id(c)= $id return count(p)', {
            id: parseInt(_id),
        });
        if (parseInt(JSON.stringify(res.records[0]['_fields'][0]['low'])) > 0) {
            console.log('Can not delete a node include children ....................');
            return new classification_entity_1.Classification();
        }
        else {
            res = await this.neo4jService.write('MATCH (c) where id(c)= $id detach delete c', { id: parseInt(_id) });
            console.log('Node deleted ................... ');
            return new classification_entity_1.Classification();
        }
    }
    async changeNodeBranch(_id, _target_parent_id) {
        await this.deleteRelations(_id);
        await this.addRelations(_id, _target_parent_id);
        return new classification_entity_1.Classification();
    }
    async deleteRelations(_id) {
        let res = await this.neo4jService.read('MATCH (c)-[r:CHILD_OF]->(p) where id(c)= $id return count(p)', {
            id: parseInt(_id),
        });
        if (parseInt(JSON.stringify(res.records[0]['_fields'][0]['low'])) > 0) {
            let res1 = await this.neo4jService.write('MATCH (c)<-[r:CHILDREN]-(p) where id(c)= $id delete r', {
                id: parseInt(_id),
            });
            let res2 = await this.neo4jService.write('MATCH (c)-[r:CHILD_OF]->(p) where id(c)= $id delete r', {
                id: parseInt(_id),
            });
        }
    }
    async addRelations(_id, _target_parent_id) {
        let res2 = await this.neo4jService.write('MATCH (c) where id(c)= $id MATCH (p) where id(p)= $target_parent_id ' + ' create (p)-[:CHILDREN]-> (c)', { id: parseInt(_id), target_parent_id: parseInt(_target_parent_id) });
        let res1 = await this.neo4jService.write('MATCH (c) where id(c)= $id MATCH (p) where id(p)= $target_parent_id ' + ' create (c)-[:CHILD_OF]-> (p)', { id: parseInt(_id), target_parent_id: parseInt(_target_parent_id) });
    }
    async findOneNodeByKey(key) {
        let result = await this.neo4jService.read("match (n {key:$key})  return n", { key: key });
        console.log(result);
        var x = result['records'][0]['_fields'][0];
        if (!result) {
            throw new facility_not_found_exception_1.ClassificationNotFountException(key);
        }
        else {
            return x;
        }
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