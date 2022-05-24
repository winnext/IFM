/* eslint-disable no-var */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Neo4jService } from 'sgnm-neo4j';
import { PaginationNeo4jParams } from 'src/common/commonDto/pagination.neo4j.dto';
import { CreateClassificationDto } from '../dto/create-classification.dto';
import { UpdateClassificationDto } from '../dto/update-classification.dto';
import { int } from 'neo4j-driver';
import { Classification } from '../entities/classification.entity';
import { BaseGraphDatabaseInterfaceRepository } from 'ifmcommon';
import { nodeHasChildException } from 'ifmcommon';
import { ClassificationNotFountException } from 'src/common/notFoundExceptions/not.found.exception';
import {
  assignDtoPropToEntity,
  createDynamicCyperObject,
  createDynamiCyperParam,
  updateNodeQuery,
} from 'src/common/func/neo4js.func';

@Injectable()
export class ClassificationRepository implements BaseGraphDatabaseInterfaceRepository<Classification> {
  constructor(private readonly neo4jService: Neo4jService) {}

  async findOneById(id: string) {
    const idNum = parseInt(id);
    let result = await this.neo4jService.read(
      'MATCH p=(n)-[:CHILDREN*]->(m) \
      WHERE  id(n) = $idNum and n.isDeleted=false and m.isDeleted=false \
      WITH COLLECT(p) AS ps \
      CALL apoc.convert.toTree(ps) yield value \
      RETURN value',
      { idNum },
    );
    var x = result['records'][0]['_fields'][0];
    if (!result) {
      throw new ClassificationNotFountException(id);
    } else if (Object.keys(x).length === 0) {
      result = await this.neo4jService.read('MATCH (n {isDeleted: false}) where id(n) = $idNum return n', { idNum });
      const o = { root: result['records'][0]['_fields'] };
      return o;
    } else {
      const o = { root: result['records'][0]['_fields'] };
      return o;
    }
  }

  async findAll(data: PaginationNeo4jParams) {
    let { page = 0, orderByColumn = 'name' } = data;
    const { limit = 10, class_name, orderBy = 'DESC' } = data;

    if (orderByColumn == 'undefined') {
      orderByColumn = 'name';
    }
    const count = await this.neo4jService.findNodeCountWithoutChildrenByClassName(class_name);

    const pagecount = Math.ceil(count / limit);

    if (page > pagecount) {
      page = pagecount;
    }
    let skip = page * limit;
    if (skip >= count) {
      skip = count - limit;
      if (skip < 0) {
        skip = 0;
      }
    }
    let getNodeWithoutParent =
      'MATCH (x {isDeleted: false}) where x.hasParent = false and x.class_name=$class_name return x ORDER BY x.' +
      orderByColumn +
      ' ' +
      orderBy +
      ' SKIP $skip LIMIT $limit';
    const result = await this.neo4jService.read(getNodeWithoutParent, {
      class_name,
      skip: int(skip),
      limit: int(limit),
    });
    const arr = [];
    for (let i = 0; i < result['records'].length; i++) {
      arr.push(result['records'][i]['_fields'][0]);
    }
    const pagination = { count, page, limit };
    const classification = [];
    classification.push(arr);
    classification.push(pagination);
    return classification;
  }

  async create(createClassificationDto: CreateClassificationDto) {
    let classification = new Classification();

    classification.label = createClassificationDto.code + ' . ' + createClassificationDto.name;
    classification = assignDtoPropToEntity(classification, createClassificationDto);

    if (createClassificationDto.parent_id || createClassificationDto.parent_id == 0) {
      //if there is a parent of created node
      const dynamicCyperParameter = createDynamiCyperParam(classification);

      //return cyper query dynmaic object
      const dynamicObject = createDynamicCyperObject(classification);

      const makeNodeConnectParent =
        ` match (y: ${createClassificationDto.labelclass} {isDeleted: false}) where id(y)= $parent_id  create (y)-[:CHILDREN]->` +
        dynamicCyperParameter;

      await this.neo4jService.write(makeNodeConnectParent, dynamicObject);

      await this.neo4jService.write(
        `match (x: ${createClassificationDto.labelclass} {isDeleted: false, key: $key}) set x.self_id = id(x)`,
        {
          key: classification.key,
        },
      );
      const createChildOfRelation = `match (x: ${createClassificationDto.labelclass} {isDeleted: false, code: $code}) \
         match (y: ${createClassificationDto.labelclass} {isDeleted: false}) where id(y)= $parent_id \
         create (x)-[:CHILD_OF]->(y)`;
      await this.neo4jService.write(createChildOfRelation, {
        code: classification.code,
        parent_id: int(createClassificationDto.parent_id),
      });
      const makeUnSelectableToParent = `match (x: ${createClassificationDto.labelclass} {isDeleted: false}) where id(x) = $parent_id set x.selectable = false`;
      await this.neo4jService.write(makeUnSelectableToParent, { parent_id: int(createClassificationDto.parent_id) });
      return 'success';
    } else {
      classification.hasParent = false;
      //return cyper query dynmaic object
      const dynamicObject = createDynamicCyperObject(classification);

      const createNode = 'CREATE ' + createDynamiCyperParam(classification);

      await this.neo4jService.write(createNode, dynamicObject);
      await this.neo4jService.write(
        `match (x:${createClassificationDto.labelclass}  {isDeleted: false,  key: $key}) set x.self_id = id(x)`,
        {
          key: classification.key,
        },
      );
      return 'success';
    }
  }
  async update(_id: string, updateClassificationto: UpdateClassificationDto) {
    const checkNodeisExist = await this.findOneById(_id);
    const { name, code } = updateClassificationto;

    const dynamicObject = createDynamicCyperObject(updateClassificationto);
    dynamicObject['label'] = code + ' . ' + name;
    dynamicObject['id'] = int(_id);

    const updateNodeCyperQuery = updateNodeQuery(_id, dynamicObject);

    if (checkNodeisExist.hasOwnProperty('root')) {
      const updatedNode = await this.neo4jService.write(updateNodeCyperQuery, dynamicObject);
      console.log(updatedNode);
      console.log('Node updated ................... ');
      return updatedNode;
    } else {
      console.log('Can not find a node for update  ....................');
      throw new ClassificationNotFountException('Can not find a node for update  ');
    }
  }
  async delete(_id: string) {
    try {
      //children count query
      const countOfChildren = await this.neo4jService.read(
        'MATCH (c {isDeleted: false})  -[r:CHILDREN]->(p {isDeleted: false}) where id(c)= $id return count(p)',
        {
          id: parseInt(_id),
        },
      );
      let res;
      console.log(countOfChildren);
      //çocuk sayısı 0 dan büyükse silme işlemi yapılmaz
      if (parseInt(JSON.stringify(countOfChildren.records[0]['_fields'][0]['low'])) > 0) {
        //find node by id
        res = await this.neo4jService.read('MATCH (c {isDeleted: false}) where id(c)= $id return c', {
          id: parseInt(_id),
        });

        //nodeHasChildException('cannot delete node with children');
        throw new HttpException('cannot delete node with children', 400);
      } else {
        //id si girilen nodun parentını getiren query
        const parent = await this.neo4jService.read(
          'MATCH (c {isDeleted: false}) where id(c)= $id match(k {isDeleted: false}) match (c)-[:CHILD_OF]->(k) return k',
          { id: parseInt(_id) },
        );
        console.log(parent);
        //update one property of silinen node
        res = await this.neo4jService.write('MATCH (c ) where id(c)= $id set c.isDeleted=true', {
          id: parseInt(_id),
        });
        if (parent['records'][0]) {
          //get children count
          res = await this.neo4jService.read(
            'MATCH (c {isDeleted: false}) where id(c)= $id MATCH (d {isDeleted: false}) MATCH (c)-[:CHILDREN]->(d) return count(d)',
            { id: parent['records'][0]['_fields'][0]['properties'].self_id },
          );
          //update one property of node
          if (res['records'][0]['_fields'][0].low == 0) {
            this.neo4jService.write(`match (n {isDeleted: false}) where id(n) = $id set n.selectable = true`, {
              id: parent['records'][0]['_fields'][0]['properties'].self_id,
            });
          }
        }
        console.log('Node deleted ................... ');
        return 'successfully deleted';
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async changeNodeBranch(_id: string, _target_parent_id: string) {
    await this.deleteRelations(_id);
    await this.addRelations(_id, _target_parent_id);
  }
  async deleteRelations(_id: string) {
    //parentı getirme querisi
    const res = await this.neo4jService.read(
      'MATCH (c {isDeleted: false})-[r:CHILD_OF]->(p {isDeleted: false}) where id(c)= $id return p',
      {
        id: parseInt(_id),
      },
    );

    //delete relation query
    if (res.records[0]) {
      await this.neo4jService.write(
        'MATCH (c {isDeleted: false})<-[r:CHILDREN]-(p {isDeleted: false}) where id(c)= $id delete r',
        {
          id: parseInt(_id),
        },
      );
      await this.neo4jService.write(
        'MATCH (c {isDeleted: false})-[r:CHILD_OF]->(p {isDeleted: false}) where id(c)= $id delete r',
        {
          id: parseInt(_id),
        },
      );
      //-------------------------------------------------

      //nodun bir propertisini güncelleme
      await this.neo4jService.write('MATCH (c {isDeleted: false}) where id(c)= $id set c.hasParent=false', {
        id: parseInt(_id),
      });

      //nodun bir relationınında kaç node olduğunu bulma
      const parentChildCount = await this.neo4jService.read(
        'MATCH (c {isDeleted: false}) where id(c)= $id MATCH (d {isDeleted: false}) MATCH (c)-[:CHILDREN]->(d) return count(d)',
        { id: res['records'][0]['_fields'][0]['properties'].self_id.low },
      );

      if (parentChildCount['records'][0]['_fields'][0].low == 0) {
        //nodun bir propertisini güncelleme
        this.neo4jService.write(`match (n {isDeleted: false}) where id(n) = $id set n.selectable = true`, {
          id: res['records'][0]['_fields'][0]['properties'].self_id.low,
        });
      }
    }
  }
  async addRelations(_id: string, _target_parent_id: string) {
    //add relation between 2 nodes query
    await this.neo4jService.write(
      'MATCH (c {isDeleted: false}) where id(c)= $id MATCH (p {isDeleted: false}) where id(p)= $target_parent_id  create (p)-[:CHILDREN]-> (c)',
      { id: parseInt(_id), target_parent_id: parseInt(_target_parent_id) },
    );
    await this.neo4jService.write(
      'MATCH (c {isDeleted: false}) where id(c)= $id MATCH (p {isDeleted: false}) where id(p)= $target_parent_id  create (c)-[:CHILD_OF]-> (p)',
      { id: parseInt(_id), target_parent_id: parseInt(_target_parent_id) },
    );

    //update 1 property of node
    await this.neo4jService.write('MATCH (c {isDeleted: false}) where id(c)= $id set c.hasParent = true', {
      id: parseInt(_id),
    });

    //update 1 property of node
    await this.neo4jService.write(
      'MATCH (c {isDeleted: false}) where id(c)= $target_parent_id set c.selectable = false',
      {
        target_parent_id: parseInt(_target_parent_id),
      },
    );
  }

  async findOneNodeByKey(key: string) {
    try {
      //find node by key
      const result = await this.neo4jService.read('match (n {isDeleted: false, key:$key})  return n', { key: key });

      if (!result) {
        throw new ClassificationNotFountException(key);
      }
      var node = result['records'][0]['_fields'][0];

      return node;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
