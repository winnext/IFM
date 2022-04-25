/* eslint-disable no-var */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { PaginationParams } from 'src/common/commonDto/pagination.dto';
import { CreateClassificationDto } from '../dto/create-classification.dto';
import { UpdateClassificationDto } from '../dto/update-classification.dto';
import { int } from 'neo4j-driver';
import { Classification } from '../entities/classification.entity';
import { BaseGraphDatabaseInterfaceRepository } from 'src/common/repositories/graph.database.crud.interface';
import { nodeHasChildException } from 'src/common/func/nodeHasChild';
import { ClassificationNotFountException } from 'src/common/notFoundExceptions/not.found.exception';

@Injectable()
export class ClassificationRepository implements BaseGraphDatabaseInterfaceRepository<Classification> {
  constructor(private readonly neo4jService: Neo4jService) {}

  async findOneById(id: string) {
    const idNum = parseInt(id);
    let result = await this.neo4jService.read(
      //"MATCH p=(n)-[:CHILDREN*]->(m) where id(n)="+id+" \
      //  WITH COLLECT(p) AS ps \
      //CALL apoc.convert.toTree(ps) yield value \
      //RETURN value",
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

    var x = result['records'][0]['_fields'][0];
    if (!result) {
      throw new ClassificationNotFountException(id);
    } else if (Object.keys(x).length === 0) {
      result = await this.neo4jService.read('MATCH (n) where id(n) = $idNum return n', { idNum });
      const o = { root: result['records'][0]['_fields'] };
      return o;
    } else {
      const o = { root: result['records'][0]['_fields'] };
      return o;
    }
  }

  async findAll(data: PaginationParams) {
    let { page, limit, orderBy, orderByColumn } = data;
    page = page || 0;
    limit = limit || 10;
    orderBy = orderBy || 'DESC';

    orderByColumn = orderByColumn || 'name';
    if (orderByColumn == 'undefined') {
      orderByColumn = 'name';
    }
    const count = await this.neo4jService.read(`MATCH (c) where c.hasParent = false RETURN count(c)`);
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
    let a =
      'MATCH (x) where x.hasParent = false return x ORDER BY x.' +
      orderByColumn +
      ' ' +
      orderBy +
      ' SKIP $skip LIMIT $limit';
    const result = await this.neo4jService.read(a, { skip: int(skip), limit: int(limit) });
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

  async create(createClassificationDto: CreateClassificationDto) {
    const classification = new Classification();
    classification.name = createClassificationDto.name;
    classification.code = createClassificationDto.code;
    classification.label = classification.code + ' . ' + classification.name;
    classification.labelclass = createClassificationDto.labelclass;
    classification.selectable = true;
    if (createClassificationDto.key) {
      classification.key = createClassificationDto.key;
    }
    if (createClassificationDto.tag) {
      classification.tag = createClassificationDto.tag;
    }

    if (createClassificationDto.parent_id || createClassificationDto.parent_id == 0) {
      let a = `(x: ${createClassificationDto.labelclass} {name: $name,code: $code ,key: $key , hasParent: $hasParent,tag: $tag ,label: $label, \
         labelclass: $labelclass,createdAt: $createdAt , updatedAt: $updatedAt, selectable: $selectable})`;
      a = ` match (y: ${createClassificationDto.labelclass}) where id(y)= $parent_id  create (y)-[:CHILDREN]->` + a;
      await this.neo4jService.write(a, {
        labelclass: createClassificationDto.labelclass,
        name: classification.name,
        code: classification.code,
        key: classification.key,
        hasParent: classification.hasParent,
        tag: classification.tag,
        label: classification.label,
        createdAt: classification.createdAt,
        updatedAt: classification.updatedAt,
        parent_id: int(createClassificationDto.parent_id),
        selectable: classification.selectable,
      });
      await this.neo4jService.write(
        `match (x: ${createClassificationDto.labelclass} {key: $key}) set x.self_id = id(x)`,
        {
          key: classification.key,
        },
      );
      const b = `match (x: ${createClassificationDto.labelclass} {code: $code}) \
         match (y: ${createClassificationDto.labelclass}) where id(y)= $parent_id \
         create (x)-[:CHILD_OF]->(y)`;
      await this.neo4jService.write(b, {
        code: classification.code,
        parent_id: int(createClassificationDto.parent_id),
      });
      const c = `match (x: ${createClassificationDto.labelclass}) where id(x) = $parent_id set x.selectable = false`;
      await this.neo4jService.write(c, { parent_id: int(createClassificationDto.parent_id) });
      return new Classification();
    } else {
      classification.hasParent = false;
      const name = classification.name;
      const code = classification.code;
      const key = classification.key;
      const hasParent = classification.hasParent;
      const tag = classification.tag;
      const label = classification.label;
      const createdAt = classification.createdAt;
      const updatedAt = classification.updatedAt;
      const labelclass = createClassificationDto.labelclass;

      const a = `CREATE (x:${createClassificationDto.labelclass} {name: \
        $name, code:$code,key:$key, hasParent: $hasParent \
        ,tag: $tag , label: $label, labelclass:$labelclass \
        , createdAt: $createdAt, updatedAt: $updatedAt })`;

      await this.neo4jService.write(a, {
        name,
        code,
        key,
        hasParent,
        tag,
        label,
        createdAt,
        updatedAt,
        labelclass,
      });
      await this.neo4jService.write(
        `match (x:${createClassificationDto.labelclass}  {key: $key}) set x.self_id = id(x)`,
        {
          key: classification.key,
        },
      );
      return new Classification();
    }
  }
  async update(_id: string, updateClassificationto: UpdateClassificationDto) {
    const checkNodeisExist = await this.findOneById(_id);
    const { name, code, tag } = updateClassificationto;

    if (checkNodeisExist.hasOwnProperty('root')) {
      const updatedNode = await this.neo4jService.write(
        'MATCH (c) where id(c)=$id set c.code= $code, c.name= $name , c.tag= $tag , c.label= $label',
        {
          name: name,
          code: code,
          tag: tag,
          label: code + ' . ' + name,
          id: int(_id),
        },
      );
      console.log('Node updated ................... ');
      return updatedNode;
    } else {
      console.log('Can not find a node for update  ....................');
      throw new ClassificationNotFountException('Can not find a node for update  ');
    }
  }
  async delete(_id: string) {
    try {
      let res = await this.neo4jService.read('MATCH (c)  -[r:CHILDREN]->(p) where id(c)= $id return count(p)', {
        id: parseInt(_id),
      });
      if (parseInt(JSON.stringify(res.records[0]['_fields'][0]['low'])) > 0) {
        res = await this.neo4jService.read('MATCH (c) where id(c)= $id return c', {
          id: parseInt(_id),
        });

        nodeHasChildException(res['records'][0]['_fields'][0]['properties'].name);
        //console.log('Can not delete a node include children ....................');
        //return new Classification();
      } else {
        const parent = await this.neo4jService.read(
          'MATCH (c) where id(c)= $id match(k) match (c)-[:CHILD_OF]-(k) return k',
          { id: parseInt(_id) },
        );

        res = await this.neo4jService.write('MATCH (c) where id(c)= $id detach delete c', { id: parseInt(_id) });
        if (parent['records'][0]) {
          res = await this.neo4jService.read(
            'MATCH (c) where id(c)= $id MATCH (d) MATCH (c)-[:CHILDREN]->(d) return count(d)',
            { id: parent['records'][0]['_fields'][0]['properties'].self_id },
          );
          if (res['records'][0]['_fields'][0].low == 0) {
            this.neo4jService.write(`match (n) where id(n) = $id set n.selectable = true`, {
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
      if (parentChildCount['records'][0]['_fields'][0].low == 0) {
        this.neo4jService.write(`match (n) where id(n) = $id set n.selectable = true`, {
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
    try {
      const result = await this.neo4jService.read('match (n {key:$key})  return n', { key: key });

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
