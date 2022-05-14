import { Neo4jService } from 'nest-neo4j/dist';
import { BaseGraphDatabaseInterfaceRepository } from 'ifmcommon';
import { Type } from '../entities/type.entity';
import { TypeNotFountException } from 'src/common/notFoundExceptions/not.found.Exceptions';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTypeDto } from '../dtos/create.type.dto';
import { int } from 'neo4j-driver';
import { GeciciTypeInterface } from '../type.service';

@Injectable()
export class TypeRepository implements GeciciTypeInterface {
  constructor(private readonly neo4jService: Neo4jService) {}

  async findOneById(id: string) {
    const idNum = parseInt(id);
    let result = await this.neo4jService.read(
      'MATCH p=(n)-[:CHILDREN*]->(m) \
      WHERE  id(n)=$idNum and  m:ChildNode  and NOT m:Type and NOT m:TypeProperty  and n.isDeleted=false and m.isActive=true \
      WITH COLLECT(p) AS ps \
      CALL apoc.convert.toTree(ps) yield value \
      RETURN value',
      { idNum },
    );

    var resultRow = result['records'][0]['_fields'][0];
    if (!result) {
      throw new TypeNotFountException('Type');
    } else {
      const o = { root: result['records'][0]['_fields'] };
      return o;
    }
  }

  async createType(createTypeDto: CreateTypeDto) {
    const type = new Type();
    type.name = createTypeDto.name;
    type.code = createTypeDto.code;
    type.label = createTypeDto.code + ' - ' + createTypeDto.name;
    type.labelclass = createTypeDto.labelclass;

    if (createTypeDto.key) {
      type.key = createTypeDto.key;
    }
    if (createTypeDto.tag) {
      type.tag = createTypeDto.tag;
    }

    let _type = 'ChildNode';
    let _typeParent = 'ChildNode';
    let _parentHasType = false;
    if (type.labelclass == 'Type') {
      _type = _type + ':Type';
      _parentHasType = true;
    }
    /*
    if (type.labelclass == 'TypeProperty') {
      _type = _type + ':Type:TypeProperty';
      _typeParent = _typeParent + ':Type';
    }
    */
    if (createTypeDto.parent_id || createTypeDto.parent_id == 0) {
      
        let parent = await this.neo4jService.write(`match (x {isDeleted: false}) where id(x)=$parent_id return x`, {
          parent_id: int(createTypeDto.parent_id), 
        });
        if (type.labelclass == 'Type' && parent["records"][0]["_fields"][0]["properties"]["hasType"]) {
          throw new HttpException({ message: 'Tip düğümüne sahip bir düğüme başka tip eklenemez.' }, HttpStatus.BAD_REQUEST);
        }
        else if (parent["records"][0]["_fields"][0]["properties"]["labelclass"] != 'ChildNode') {
          throw new HttpException({ message: 'Tip düğümüne yeni düğüm eklenemez.' }, HttpStatus.BAD_REQUEST);
        }
        
     
      //if there is a parent of created node
      let makeNodeConnectParent = `(x: ${_type} {name: $name,code: $code ,key: $key , hasParent: $hasParent,tag: $tag ,label: $label, \
                                                             labelclass:$labelclass,createdAt: $createdAt , updatedAt: $updatedAt, isActive :$isActive,\ 
                                                             isDeleted: $isDeleted, hasType: $hasType})`;
      makeNodeConnectParent =
        ` match (y: ${_typeParent} {isDeleted: false}) where id(y)= $parent_id  create (y)-[:CHILDREN]->` +
        makeNodeConnectParent;
        await this.neo4jService.write(makeNodeConnectParent, {
        labelclass: type.labelclass,
        name: type.name,
        code: type.code,
        key: type.key,
        hasParent: type.hasParent,
        tag: type.tag,
        label: type.label,
        createdAt: type.createdAt,
        updatedAt: type.updatedAt,
        isActive: type.isActive,
        isDeleted: type.isDeleted,
        parent_id: createTypeDto.parent_id,
        hasType: type.hasType,
      });
      if (type.labelclass == 'Type') {
        await this.neo4jService.write(`match (x {isDeleted: false}) where id(x)=$parent_id set x.hasType=$hasParentType`, {
          parent_id: int(createTypeDto.parent_id), hasParentType: _parentHasType, 
        });
      }
     
      //await this.neo4jService.write(`match (x: ${_type}  {isDeleted: false,key: $key}) set x.self_id = id(x)`, {
      //  key: type.key,
      //});
      const createChildOfRelation = `match (x: ${_type} {isDeleted: false,code: $code}) \
         match (y: ${_typeParent} {isDeleted: false}) where id(y)= $parent_id \
         create (x)-[:CHILD_OF]->(y)`;
      await this.neo4jService.write(createChildOfRelation, {
        code: type.code,
        parent_id: int(createTypeDto.parent_id),
      });
      return new Type();
    } else {

      if (type.labelclass == 'Type') {
        throw new HttpException({ message: 'Bir düğüme bağlı olmayan tip düğümü eklememez.' }, HttpStatus.BAD_REQUEST);
      }

      type.hasParent = false;

      const labelclass = type.labelclass;
      const name = type.name;
      const code = type.code;
      const key = type.key;
      const hasParent = type.hasParent;
      const tag = type.tag;
      const label = type.label;
      const createdAt = type.createdAt;
      const updatedAt = type.updatedAt;
      const isActive = type.isActive;
      const isDeleted = type.isDeleted;
      const hasType = type.hasType;

      const createNode = `CREATE (x:${_type} {name: \
        $name, code:$code,key:$key, hasParent: $hasParent \
        ,tag: $tag , label: $label, labelclass:$labelclass \
        , createdAt: $createdAt, updatedAt: $updatedAt,isActive :$isActive\ 
        , isDeleted: $isDeleted, hasType: $hasType })`;

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
        isActive,
        isDeleted,
        hasType,
      });
      //await this.neo4jService.write(
      //  `match (x:${type.labelclass} {isDeleted: false,key: $key}) set x.self_id = id(x)`,
      //  {
      //    key: type.key,
      //  },
      //);
      return new Type();
    }
  }
}
