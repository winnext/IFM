import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Neo4jService } from 'nest-neo4j/dist';
import { PaginationParams } from 'src/common/commonDto/pagination.dto';
import { ClassificationNotFountException } from 'src/common/notFoundExceptions/facility.not.found.exception';
import { CreateClassificationDto } from '../dto/create-classification.dto';
import { UpdateClassificationDto } from '../dto/update-classification.dto';
import { int } from 'neo4j-driver';

import { Classification } from '../entities/classification.entity';
import { BaseGraphDatabaseInterfaceRepository } from 'src/common/repositories/graph.database.crud.interface';
``
@Injectable()
export class ClassificationRepository implements BaseGraphDatabaseInterfaceRepository<Classification> {
  constructor(
    private readonly neo4jService: Neo4jService,
    @InjectModel(Classification.name)
    private readonly classificationModel: Model<Classification>,
  ) {}
  findWithRelations(relations: any): Promise<Classification[]> {
    throw new Error(relations);
  }
  async findOneById(id: string) {
    let idNum = parseInt(id);
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
      let o = { root: result['records'][0]['_fields'] };
      return o;
    } else {
      let o = { root: result['records'][0]['_fields'] };
      return o;
    }
  }

  async findAll(data: PaginationParams) {
    let { page, limit, orderBy, orderByColumn } = data;
    page = page || 0;
    limit = limit || 10;
    orderBy = orderBy || 'DESC';

    orderByColumn = orderByColumn || 'name';
    const count = await this.neo4jService.read(`MATCH (c) where c.hasParent = false RETURN count(c)`);
    let coun = count['records'][0]['_fields'][0].low;
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

    const result = await this.neo4jService.read(
      'MATCH (x) where x.hasParent = false return x ORDER BY x.' + orderByColumn + '$orderBy SKIP $skip LIMIT $limit',
      { limit: int(limit), skip: int(skip), orderBy: orderBy, orderByColumn: orderByColumn },
    );
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
        parent_id: int(createClassificationDto.parent_id),
        selectable: classification.selectable
      });
      await this.neo4jService.write(`match (x: ${createClassificationDto.labelclass} {key: $key}) set x.self_id = id(x)`, {
        key: classification.key
      });
      let b =
        `match (x: ${createClassificationDto.labelclass} {code: $code}) \
         match (y: ${createClassificationDto.labelclass}) where id(y)= $parent_id \
         create (x)-[:CHILD_OF]->(y)`;
      result = await this.neo4jService.write(b, {
        code: classification.code,
        parent_id: int(createClassificationDto.parent_id)
      });
      let c =
        `match (x: ${createClassificationDto.labelclass}) where id(x) = $parent_id set x.selectable = false`;
      result = await this.neo4jService.write(c, {parent_id: int(createClassificationDto.parent_id)});  
      return new Classification();
    } else {
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

      let a =
        `CREATE (x:${createClassificationDto.labelclass} {name: \
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
      return new Classification();
    }
  }
  async update(_id: string, updateClassificationto: UpdateClassificationDto) {
    let res = await this.neo4jService.read('MATCH (p) where id(p)=$id return count(p)', { id: parseInt(_id) });

    if (parseInt(JSON.stringify(res.records[0]['_fields'][0]['low'])) > 0) {
      res = await this.neo4jService.write(
        'MATCH (c) where id(c)=$id set c.code= $code, c.name= $name , c.tag= $tag , c.label= $label',
        {
          name: updateClassificationto.name,
          code: updateClassificationto.code,
          tag: updateClassificationto.tag,
          label: updateClassificationto.code + ' . ' + updateClassificationto.name,
          id: int(_id),
        },
      );
      console.log('Node updated ................... ');
      return new Classification();
    } else {
      console.log('Can not find a node for update  ....................');
      return new Classification();
    }
  }
  async delete(_id: string) {
    let res = await this.neo4jService.read('MATCH (c)  -[r:CHILDREN]->(p) where id(c)= $id return count(p)', {
      id: parseInt(_id),
    });
    if (parseInt(JSON.stringify(res.records[0]['_fields'][0]['low'])) > 0) {
      console.log('Can not delete a node include children ....................');
      return new Classification();
    } else {
      let parent =  await this.neo4jService.read('MATCH (c) where id(c)= $id match(k) match (c)-[:CHILD_OF]-(k) return k', { id: parseInt(_id) });
      
      res = await this.neo4jService.write('MATCH (c) where id(c)= $id detach delete c', { id: parseInt(_id) });
      if ( parent["records"][0] ) {
        res =  await this.neo4jService.read('MATCH (c) where id(c)= $id MATCH (d) MATCH (c)-[:CHILDREN]->(d) return count(d)', 
        { id: parent["records"][0]["_fields"][0]["properties"].self_id });
        if (res["records"][0]["_fields"][0].low == 0) {
          let result = this.neo4jService.write(`match (n) where id(n) = $id set n.selectable = true`, 
          { id: parent["records"][0]["_fields"][0]["properties"].self_id });
          
        }
      }
      console.log('Node deleted ................... ');
      return new Classification();
    }
  }
  async changeNodeBranch(_id: string, _target_parent_id: string) {
    await this.deleteRelations(_id);
    await this.addRelations(_id, _target_parent_id);
    return new Classification();
  }
  async deleteRelations(_id: string) {
    let res = await this.neo4jService.read('MATCH (c)-[r:CHILD_OF]->(p) where id(c)= $id return p', {
       id: parseInt(_id),
    });

    if (res.records[0]) {
      let res1 = await this.neo4jService.write('MATCH (c)<-[r:CHILDREN]-(p) where id(c)= $id delete r', {
        id: parseInt(_id),
      });

      let res2 = await this.neo4jService.write('MATCH (c)-[r:CHILD_OF]->(p) where id(c)= $id delete r', {
        id: parseInt(_id),
      });

      let res3 = await this.neo4jService.write('MATCH (c) where id(c)= $id set c.hasParent=false', {
        id: parseInt(_id),
      });

      let parentChildCount =  await this.neo4jService.read('MATCH (c) where id(c)= $id MATCH (d) MATCH (c)-[:CHILDREN]->(d) return count(d)', 
      { id: res["records"][0]["_fields"][0]["properties"].self_id.low });
      if (parentChildCount["records"][0]["_fields"][0].low == 0) {
        let result = this.neo4jService.write(`match (n) where id(n) = $id set n.selectable = true`, 
        { id: res["records"][0]["_fields"][0]["properties"].self_id.low  });
      }
    }
  }
  async addRelations(_id: string, _target_parent_id: string) {
    let res2 = await this.neo4jService.write(
      'MATCH (c) where id(c)= $id MATCH (p) where id(p)= $target_parent_id  create (p)-[:CHILDREN]-> (c)',
      { id: parseInt(_id), target_parent_id: parseInt(_target_parent_id) },
    );
    let res1 = await this.neo4jService.write(
      'MATCH (c) where id(c)= $id MATCH (p) where id(p)= $target_parent_id  create (c)-[:CHILD_OF]-> (p)',
      { id: parseInt(_id), target_parent_id: parseInt(_target_parent_id) },
    );
    
    let res31 = await this.neo4jService.write('MATCH (c) where id(c)= $id set c.hasParent = true', {id: parseInt(_id)});
    let res32 = await this.neo4jService.write('MATCH (c) where id(c)= $target_parent_id set c.selectable = false', {target_parent_id: parseInt(_target_parent_id)});
  }

  async findOneNodeByKey(key: string) {
   
    let result = await this.neo4jService.read(
        "match (n {key:$key})  return n", {key: key}
    );


    var x = result['records'][0]['_fields'][0];
    if (!result) {
      throw new ClassificationNotFountException(key);
    } 
    else {
      return x;
    }
  }
}
