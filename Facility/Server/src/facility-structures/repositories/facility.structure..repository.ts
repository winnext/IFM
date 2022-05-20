import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FacilityStructureNotFountException } from '../../common/notFoundExceptions/not.found.exception';

import { CreateFacilityStructureDto } from '../dto/create-facility-structure.dto';
import { UpdateFacilityStructureDto } from '../dto/update-facility-structure.dto';
import { FacilityStructure } from '../entities/facility-structure.entity';
import { Neo4jService } from 'sgnm-neo4j';
import { int } from 'neo4j-driver';

import { PaginationNeo4jParams } from 'src/common/commonDto/pagination.neo4j.dto';
import { BaseGraphDatabaseInterfaceRepository } from 'ifmcommon';
import {
  assignDtoPropToEntity,
  createDynamicCyperObject,
  createDynamiCyperParam,
  updateNodeQuery,
} from 'src/common/func/neo4js.func';

@Injectable()
export class FacilityStructureRepository implements BaseGraphDatabaseInterfaceRepository<FacilityStructure> {
  constructor(private readonly neo4jService: Neo4jService) {}

  async findOneById(id: string) {
    const idNum = parseInt(id);

    //find node with childred by id
    let result = await this.neo4jService.read(
      'MATCH p=(n)-[:CHILDREN*]->(m) \
      WHERE  id(n) = $idNum and n.isDeleted=false and m.isDeleted=false \
      WITH COLLECT(p) AS ps \
      CALL apoc.convert.toTree(ps) yield value \
      RETURN value',
      { idNum },
    );

    var resultRow = result['records'][0]['_fields'][0];

    if (!result) {
      throw new FacilityStructureNotFountException(id);
      //if not found node with children
    } else if (Object.keys(resultRow)?.length === 0) {
      //find node without children by id
      const rootNode = await this.neo4jService.read('MATCH (n {isDeleted: false}) where id(n) = $idNum return n', {
        idNum,
      });
      const rootNodeObject = { root: rootNode['records'][0]['_fields'] };
      return rootNodeObject;
    } else {
      const rootWithChildren = { root: result['records'][0]['_fields'] };
      return rootWithChildren;
    }
  }

  async findAll(data: PaginationNeo4jParams) {
    let { page = 0, orderByColumn = 'name' } = data;
    const { limit = 10, class_name } = data;

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

    const result = await this.neo4jService.findNodeWithoutChildrenByClassName({
      class_name,
      skip,
      limit,
    });

    const facilityStructure = [];
    result.records.forEach((element) => {
      facilityStructure.push(element.get('node'));
    });

    const pagination = { count, page, limit };
    const facilityStructureWithPagination = [];
    facilityStructureWithPagination.push(facilityStructure);
    facilityStructureWithPagination.push(pagination);
    return facilityStructureWithPagination;
  }

  async create(createFacilityStructureDto: CreateFacilityStructureDto) {
    let facilityStructure = new FacilityStructure();
    facilityStructure.label = createFacilityStructureDto.code + ' . ' + createFacilityStructureDto.name;

    //dynamicall assign dtos properties to entity
    facilityStructure = assignDtoPropToEntity(facilityStructure, createFacilityStructureDto);

    if (createFacilityStructureDto.parent_id || createFacilityStructureDto.parent_id == 0) {
      //dynamicall create queries paramaters
      const dynamicCyperParameter = createDynamiCyperParam(facilityStructure);

      //if there is a parent of created node

      //return cyper query dynmaic object
      const dynamicObject = createDynamicCyperObject(facilityStructure);

      const makeNodeConnectParent =
        ` match (y: ${facilityStructure.labelclass} {isDeleted: false}) where id(y)= $parent_id  create (y)-[:CHILDREN]->` +
        dynamicCyperParameter;

      await this.neo4jService.write(makeNodeConnectParent, dynamicObject);

      await this.neo4jService.write(
        `match (x: ${facilityStructure.labelclass}  {isDeleted: false,key: $key}) set x.self_id = id(x)`,
        {
          key: facilityStructure.key,
        },
      );
      const createChildOfRelation = `match (x: ${facilityStructure.labelclass} {isDeleted: false,code: $code}) \
         match (y: ${facilityStructure.labelclass} {isDeleted: false}) where id(y)= $parent_id \
         create (x)-[:CHILD_OF]->(y)`;
      await this.neo4jService.write(createChildOfRelation, {
        code: facilityStructure.code,
        parent_id: int(createFacilityStructureDto.parent_id),
      });
      const makeUnSelectableToParent = `match (x: ${facilityStructure.labelclass} {isDeleted: false}) where id(x) = $parent_id set x.selectable = false`;
      await this.neo4jService.write(makeUnSelectableToParent, { parent_id: int(createFacilityStructureDto.parent_id) });
      return facilityStructure;
    } else {
      facilityStructure.hasParent = false;
      const dynamicObject = createDynamicCyperObject(facilityStructure);

      // const createNode = `CREATE (x:${createFacilityStructureDto.labelclass} {name: \
      //   $name, code:$code,key:$key, hasParent: $hasParent \
      //   ,tag: $tag , label: $label, labelclass:$labelclass \
      //   , createdAt: $createdAt, updatedAt: $updatedAt, type: $type, typeId: $typeId,description: $description,isActive :$isActive\
      //   , isDeleted: $isDeleted, class_name: $class_name, selectable: $selectable })`;

      const x = 'CREATE ' + createDynamiCyperParam(facilityStructure);

      await this.neo4jService.write(x, dynamicObject);
      await this.neo4jService.write(
        `match (x:${facilityStructure.labelclass} {isDeleted: false,key: $key}) set x.self_id = id(x)`,
        {
          key: facilityStructure.key,
        },
      );
      return facilityStructure;
    }
  }
  async update(_id: string, updateFacilityStructureDto: UpdateFacilityStructureDto) {
    const checkNodeisExist = await this.findOneById(_id);
    const { name, code, tag, description, isActive, typeId, type } = updateFacilityStructureDto;

    const dynamicObject = createDynamicCyperObject(updateFacilityStructureDto);

    dynamicObject['label'] = code + ' . ' + name;
    dynamicObject['id'] = int(_id);

    const updateNodeQuer = updateNodeQuery(_id, dynamicObject);
    if (checkNodeisExist.hasOwnProperty('root')) {
      //id sini dışardan alan dynamic bir updateNode fonksiyonu yazılacak
      const updatedNode = await this.neo4jService.write(updateNodeQuer, dynamicObject);
      console.log('Node updated ................... ');
      return updatedNode;
    } else {
      console.log('Can not find a node for update  ....................');
      throw new FacilityStructureNotFountException('Can not find a node for update  ');
    }
  }
  async delete(_id: string) {
    try {
      let nodeChildCount = await this.neo4jService.read(
        'MATCH (c {isDeleted: false})  -[r:CHILDREN]->(p {isDeleted: false}) where id(c)= $id return count(p)',
        {
          id: parseInt(_id),
        },
      );
      if (parseInt(JSON.stringify(nodeChildCount.records[0]['_fields'][0]['low'])) > 0) {
        let node = await this.neo4jService.read('MATCH (c {isDeleted: false}) where id(c)= $id return c', {
          id: parseInt(_id),
        });
        throw new HttpException({ message: 'Çocuğu olan node silinemez' }, HttpStatus.BAD_REQUEST);
        // nodeHasChildException(node['records'][0]['_fields'][0]['properties'].name);
      } else {
        const parent = await this.neo4jService.read(
          'MATCH (c {isDeleted: false}) where id(c)= $id match(k {isDeleted: false}) match (c)-[:CHILD_OF]-(k) return k',
          { id: parseInt(_id) },
        );

        let deleteNode = await this.neo4jService.write(
          'MATCH (c {isDeleted: false}) where id(c)= $id set c.isDeleted = true',
          {
            id: parseInt(_id),
          },
        );
        if (parent['records'][0]) {
          let hasParentChild = await this.neo4jService.read(
            'MATCH (c {isDeleted: false}) where id(c)= $id MATCH (d {isDeleted: false}) MATCH (c)-[:CHILDREN]->(d) return count(d)',
            { id: parent['records'][0]['_fields'][0]['properties'].self_id },
          );
          if (hasParentChild['records'][0]['_fields'][0].low == 0) {
            //if parent has no child
            this.neo4jService.write(`match (n {isDeleted: false}) where id(n) = $id set n.selectable = true`, {
              // make parent node to selectable
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

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async changeNodeBranch(_id: string, _target_parent_id: string) {
    await this.deleteRelations(_id);
    await this.addRelations(_id, _target_parent_id);
  }
  async deleteRelations(_id: string) {
    const res = await this.neo4jService.read(
      'MATCH (c {isDeleted: false})-[r:CHILD_OF]->(p {isDeleted: false}) where id(c)= $id return p',
      {
        id: parseInt(_id),
      },
    );

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

      await this.neo4jService.write('MATCH (c {isDeleted: false}) where id(c)= $id set c.hasParent=false', {
        id: parseInt(_id),
      });

      const parentChildCount = await this.neo4jService.read(
        'MATCH (c {isDeleted: false}) where id(c)= $id MATCH (d {isDeleted: false}) MATCH (c)-[:CHILDREN]->(d) return count(d)',
        { id: res['records'][0]['_fields'][0]['properties'].self_id.low },
      );
      if (parentChildCount['records'][0]['_fields'][0].low == 0) {
        //if parent has no child
        this.neo4jService.write(`match (n  {isDeleted: false}) where id(n) = $id set n.selectable = true`, {
          // make parent node to selectable
          id: res['records'][0]['_fields'][0]['properties'].self_id.low,
        });
      }
    }
  }
  async addRelations(_id: string, _target_parent_id: string) {
    await this.neo4jService.write(
      'MATCH (c {isDeleted: false}) where id(c)= $id MATCH (p {isDeleted: false}) where id(p)= $target_parent_id  create (p)-[:CHILDREN]-> (c)',
      { id: parseInt(_id), target_parent_id: parseInt(_target_parent_id) },
    );
    await this.neo4jService.write(
      'MATCH (c {isDeleted: false}) where id(c)= $id MATCH (p {isDeleted: false}) where id(p)= $target_parent_id  create (c)-[:CHILD_OF]-> (p)',
      { id: parseInt(_id), target_parent_id: parseInt(_target_parent_id) },
    );

    await this.neo4jService.write('MATCH (c {isDeleted: false}) where id(c)= $id set c.hasParent = true', {
      id: parseInt(_id),
    });
    await this.neo4jService.write(
      'MATCH (c {isDeleted: false}) where id(c)= $target_parent_id set c.selectable = false',
      {
        target_parent_id: parseInt(_target_parent_id),
      },
    );
  }

  async findOneNodeByKey(key: string) {
    const result = await this.neo4jService.read('match (n {isDeleted: false, key:$key})  return n', { key: key });

    const x = result['records'][0]['_fields'][0];
    if (!result) {
      throw new FacilityStructureNotFountException(key);
    } else {
      return x;
    }
  }
}
