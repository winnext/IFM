import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationParams } from 'src/common/commonDto/pagination.dto';
import { checkObjectIddİsValid } from 'src/common/func/objectId.check';
import { FacilityNotFountException, FacilityStructureNotFountException } from '../../common/notFoundExceptions/not.found.exception';
import { CreateFacilityStructureDto } from '../dto/create-facility-structure.dto';
import { UpdateFacilityStructureDto } from '../dto/update-facility-structure.dto';
import { FacilityStructure } from '../entities/facility-structure.entity';
import { Neo4jService } from 'nest-neo4j/dist';
import { int } from 'neo4j-driver';
import { BaseGraphDatabaseInterfaceRepository } from 'src/common/repositories/graph.database.crud.interface';
import { nodeHasChildException } from 'src/common/func/nodeHasChild';

@Injectable()
export class FacilityStructureRepository implements BaseGraphDatabaseInterfaceRepository<FacilityStructure>{
  constructor(
             private readonly neo4jService: Neo4jService, 
             @InjectModel(FacilityStructure.name) 
             private readonly facilityStructureModel: Model<FacilityStructure>) {}
  findWithRelations(relations: any): Promise<FacilityStructure[]> {
    throw new Error(relations);
  }
  async findOneById(id: string) {
    const idNum = parseInt(id);
    let result = await this.neo4jService.read(

      'MATCH (n)-[:CHILDREN*]->(m) \
      WHERE  id(n) = $idNum  and  NOT (m)-[:CHILDREN]->() \
      WITH n, m \
      ORDER BY n.code, m.code \
      MATCH p=(n)-[:CHILDREN*]->(m) \
      WHERE NOT ()-[:CHILDREN]->(n) \
      WITH COLLECT(p) AS ps \
      CALL apoc.convert.toTree(ps) yield value \
      RETURN value',
      { idNum },
    );

    var resultRow = result['records'][0]['_fields'][0];
    if (!result) {
      throw new  FacilityStructureNotFountException(id);
    } else if (Object.keys(resultRow).length === 0) {
      result = await this.neo4jService.read('MATCH (n) where id(n) = $idNum return n', { idNum });
      const o = { root: result['records'][0]['_fields'] };
      return o;
    } else {
      const o = { root: result['records'][0]['_fields'] };
      return o;
    }
  }
  async findAll(data: PaginationParams, class_name: string) {
    let { page, limit, orderBy, orderByColumn } = data;
    page = page || 0;
    limit = limit || 10;
    orderBy = orderBy || 'DESC';

    orderByColumn = orderByColumn || 'name';
    if (orderByColumn == 'undefined') {
      orderByColumn = 'name';
    }
    const count = await this.neo4jService.read(`MATCH (c) where c.hasParent = false and c.class_name=$class_name RETURN count(c)`,
    {class_name:class_name});
    const coun = count['records'][0]['_fields'][0].low;
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
    let getNodeWithoutParent =
      'MATCH (x) where x.hasParent = false and x.class_name=$class_name return x ORDER BY x.' +
      orderByColumn +
      ' ' +
      orderBy +
      ' SKIP $skip LIMIT $limit';
    const result = await this.neo4jService.read(getNodeWithoutParent, {class_name:class_name, skip: int(skip), limit: int(limit) });
    const arr = [];
    for (let i = 0; i < result['records'].length; i++) {
      arr.push(result['records'][i]['_fields'][0]);
    }
    const pagination = { count: coun, page: page, limit: limit };
    const classification = [];
    classification.push(arr);
    classification.push(pagination);
    return classification;
  }
  async create(createFacilityStructureDto: CreateFacilityStructureDto) {
    const facilityStructure = new FacilityStructure();
    facilityStructure.type = createFacilityStructureDto.type;
    facilityStructure.name = createFacilityStructureDto.name;
    facilityStructure.code = createFacilityStructureDto.code;
    facilityStructure.description = createFacilityStructureDto.description
    facilityStructure.label = createFacilityStructureDto.code + ' . ' + createFacilityStructureDto.name;
    facilityStructure.labelclass = createFacilityStructureDto.labelclass;
    facilityStructure.selectable = true;
    if (createFacilityStructureDto.key) {
      facilityStructure.key = createFacilityStructureDto.key;
    }
    if (createFacilityStructureDto.tag) {
      facilityStructure.tag = createFacilityStructureDto.tag;
    }

    if (createFacilityStructureDto.parent_id || createFacilityStructureDto.parent_id == 0) { //if there is a parent of created node
      let makeNodeConnectParent = `(x: ${createFacilityStructureDto.labelclass} {name: $name,code: $code ,key: $key , hasParent: $hasParent,tag: $tag ,label: $label, \
                                                             labelclass:$labelclass,createdAt: $createdAt , updatedAt: $updatedAt, \
                                                             selectable: $selectable, type: $type,description: $description,isActive :$isActive,\ 
                                                             isDeleted: $isDeleted, class_name: $className })`;
      makeNodeConnectParent = ` match (y: ${createFacilityStructureDto.labelclass}) where id(y)= $parent_id  create (y)-[:CHILDREN]->` +
      makeNodeConnectParent;
      await this.neo4jService.write(makeNodeConnectParent, {
        labelclass: facilityStructure.labelclass,
        name: facilityStructure.name,
        code: facilityStructure.code,
        key: facilityStructure.key,
        hasParent: facilityStructure.hasParent,
        tag: facilityStructure.tag,
        label: facilityStructure.label,
        createdAt: facilityStructure.createdAt,
        updatedAt: facilityStructure.updatedAt,
        selectable: facilityStructure.selectable,
        type: facilityStructure.type,
        description : facilityStructure.description,
        isActive : facilityStructure.isActive,
        isDeleted: facilityStructure.isDeleted,
        className: facilityStructure.class_name,
        parent_id : createFacilityStructureDto.parent_id
        
      });
      await this.neo4jService.write(
        `match (x: ${facilityStructure.labelclass} {key: $key}) set x.self_id = id(x)`,
        {
          key: facilityStructure.key,
        },
      );
      const createChildOfRelation = `match (x: ${facilityStructure.labelclass} {code: $code}) \
         match (y: ${facilityStructure.labelclass}) where id(y)= $parent_id \
         create (x)-[:CHILD_OF]->(y)`;
      await this.neo4jService.write(createChildOfRelation, {
        code: facilityStructure.code,
        parent_id: int(createFacilityStructureDto.parent_id),
      });
      const makeUnSelectableToParent = `match (x: ${facilityStructure.labelclass}) where id(x) = $parent_id set x.selectable = false`;
      await this.neo4jService.write(makeUnSelectableToParent, { parent_id: int(createFacilityStructureDto.parent_id) });
      return new FacilityStructure();
    } else {

      facilityStructure.hasParent = false;
      const name = facilityStructure.name;
      const code = facilityStructure.code;
      const key = facilityStructure.key;
      const hasParent = facilityStructure.hasParent;
      const tag = facilityStructure.tag;
      const label = facilityStructure.label;
      const createdAt = facilityStructure.createdAt;
      const updatedAt = facilityStructure.updatedAt;
      const labelclass = facilityStructure.labelclass;
      const selectable = facilityStructure.selectable;
      const type =facilityStructure.type;
      const description =facilityStructure.description;
      const isActive = facilityStructure.isActive;
      const isDeleted = facilityStructure.isDeleted;
      const className = facilityStructure.class_name;

      const createNode = `CREATE (x:${createFacilityStructureDto.labelclass} {name: \
        $name, code:$code,key:$key, hasParent: $hasParent \
        ,tag: $tag , label: $label, labelclass:$labelclass \
        , createdAt: $createdAt, updatedAt: $updatedAt, type: $type,description: $description,isActive :$isActive\ 
        , isDeleted: $isDeleted, class_name: $className, selectable: $selectable })`;

      await this.neo4jService.write(createNode, {
        name,
        code,
        key,
        hasParent,
        tag,
        label,
        createdAt,
        updatedAt,
        labelclass,
        type,
        description,
        isActive ,
        isDeleted,
        className,
        selectable
      });
      await this.neo4jService.write(
        `match (x:${facilityStructure.labelclass}  {key: $key}) set x.self_id = id(x)`,
        {
          key: facilityStructure.key,
        },
      );
      return new FacilityStructure();
    }
  }
  async update(_id: string, updateFacilityStructureDto: UpdateFacilityStructureDto) {
    const checkNodeisExist = await this.findOneById(_id);
    const { name, code, tag , description, isActive, isDeleted } = updateFacilityStructureDto;

    if (checkNodeisExist.hasOwnProperty('root')) {
      const updatedNode = await this.neo4jService.write(
        'MATCH (c) where id(c)=$id set c.code= $code, c.name= $name , c.tag= $tag , c.label= $label, c.description = $description, '+
           'c.isActive = $isActive, c.isDeleted = $isDeleted',
        {
          name: name,
          code: code,
          tag: tag,
          label: code + ' . ' + name,
          description: description,
          isActive: isActive,
          isDeleted: isDeleted,
          id: int(_id)
        },
      );
      console.log('Node updated ................... ');
      return updatedNode;
    } else {
      console.log('Can not find a node for update  ....................');
      throw new FacilityStructureNotFountException('Can not find a node for update  ');
    }
  }
  async delete(_id: string) {
    try {
      let nodeChildCount = await this.neo4jService.read('MATCH (c)  -[r:CHILDREN]->(p) where id(c)= $id return count(p)', {
        id: parseInt(_id),
      });
      if (parseInt(JSON.stringify(nodeChildCount.records[0]['_fields'][0]['low'])) > 0) {
        let node = await this.neo4jService.read('MATCH (c) where id(c)= $id return c', {
          id: parseInt(_id),
        });
        nodeHasChildException(node['records'][0]['_fields'][0]['properties'].name);
      } else {
        const parent = await this.neo4jService.read(
          'MATCH (c) where id(c)= $id match(k) match (c)-[:CHILD_OF]-(k) return k',
          { id: parseInt(_id) },
        );

        let deleteNode = await this.neo4jService.write('MATCH (c) where id(c)= $id detach delete c', { id: parseInt(_id) });
        if (parent['records'][0]) {
          let hasParentChild = await this.neo4jService.read(
            'MATCH (c) where id(c)= $id MATCH (d) MATCH (c)-[:CHILDREN]->(d) return count(d)',
            { id: parent['records'][0]['_fields'][0]['properties'].self_id },
          );
          if (hasParentChild['records'][0]['_fields'][0].low == 0) { //if parent has no child
            this.neo4jService.write(`match (n) where id(n) = $id set n.selectable = true`, { // make parent node to selectable
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
    const res = await this.neo4jService.read('MATCH (c)-[r:CHILD_OF]->(p) where id(c)= $id return p', {
      id: parseInt(_id),
    });

    if (res.records[0]) {
      await this.neo4jService.write('MATCH (c)<-[r:CHILDREN]-(p) where id(c)= $id delete r', {
        id: parseInt(_id),
      });

      await this.neo4jService.write('MATCH (c)-[r:CHILD_OF]->(p) where id(c)= $id delete r', {
        id: parseInt(_id),
      });

      await this.neo4jService.write('MATCH (c) where id(c)= $id set c.hasParent=false', {
        id: parseInt(_id),
      });

      const parentChildCount = await this.neo4jService.read(
        'MATCH (c) where id(c)= $id MATCH (d) MATCH (c)-[:CHILDREN]->(d) return count(d)',
        { id: res['records'][0]['_fields'][0]['properties'].self_id.low },
      );
      if (parentChildCount['records'][0]['_fields'][0].low == 0) {   //if parent has no child
        this.neo4jService.write(`match (n) where id(n) = $id set n.selectable = true`, {   // make parent node to selectable
          id: res['records'][0]['_fields'][0]['properties'].self_id.low,
        });
      }
    }
  }
  async addRelations(_id: string, _target_parent_id: string) {
    await this.neo4jService.write(
      'MATCH (c) where id(c)= $id MATCH (p) where id(p)= $target_parent_id  create (p)-[:CHILDREN]-> (c)',
      { id: parseInt(_id), target_parent_id: parseInt(_target_parent_id) },
    );
    await this.neo4jService.write(
      'MATCH (c) where id(c)= $id MATCH (p) where id(p)= $target_parent_id  create (c)-[:CHILD_OF]-> (p)',
      { id: parseInt(_id), target_parent_id: parseInt(_target_parent_id) },
    );

    await this.neo4jService.write('MATCH (c) where id(c)= $id set c.hasParent = true', {
      id: parseInt(_id),
    });
    await this.neo4jService.write('MATCH (c) where id(c)= $target_parent_id set c.selectable = false', {
      target_parent_id: parseInt(_target_parent_id),
    });
  }

  async findOneNodeByKey(key: string) {
    const result = await this.neo4jService.read('match (n {key:$key})  return n', { key: key });

    var x = result['records'][0]['_fields'][0];
    if (!result) {
      throw  new FacilityStructureNotFountException(key);
    } else {
      return x;
    }
  }
}
