import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { types } from 'joi';
import { Model } from 'mongoose';
import { Neo4jService } from 'nest-neo4j/dist';
import { PaginationParams } from 'src/common/commonDto/pagination.dto';
import { ClassificationNotFountException } from 'src/common/notFoundExceptions/facility.not.found.exception';
import { BaseInterfaceRepository } from 'src/common/repositories/crud.repository.interface';
import { CreateClassificationDto } from '../dto/create-classification.dto';
import { UpdateClassificationDto } from '../dto/update-classification.dto';
import {types as neo4j_types, DateTime}  from 'neo4j-driver';

import { Classification } from '../entities/classification.entity';
import { ConfigModule } from '@nestjs/config';

@Injectable()
export class ClassificationRepository implements BaseInterfaceRepository<Classification> {
  constructor(
    private readonly neo4jService: Neo4jService,
    @InjectModel(Classification.name)
    private readonly classificationModel: Model<Classification>,
  ) {}
  findWithRelations(relations: any): Promise<Classification[]> {
    throw new Error(relations);
  }
  async findOneById(id: string) {
    let result = await this.neo4jService.read(
      "MATCH p=(n)-[:CHILDREN*]->(m) where id(n)="+id+" \
      WITH COLLECT(p) AS ps \
      CALL apoc.convert.toTree(ps) yield value \
      RETURN value;",
    );
    var x = result["records"][0]["_fields"][0];
    if (!result) {
      throw new ClassificationNotFountException(id);
    } 
    else if (Object.keys(x).length  === 0) {
       result = await this.neo4jService.read(
        "MATCH (n) where id(n) = "+id+" return n",
      );
      let o = {"root":result["records"][0]["_fields"]};
      return o;
    }
    else {
      let o = {"root":result["records"][0]["_fields"]};
      return o;
    }

  }

  // Test Amaçlı //////
  async getHello(): Promise<any> {
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
  /////////////////////

  async findAll(data: PaginationParams) {
    let { page, limit, orderBy, orderByColumn } = data;
    page = page || 0;
    limit = limit || 5;
    orderBy = orderBy || 'DESC';

    orderByColumn = orderByColumn || 'name';
    const count = await this.neo4jService.read(
      `MATCH (c) where c.hasParent = false RETURN count(c)`,
    );
    //console.log(count["records"][0]["length"]);
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

    const result = await this.neo4jService.read(
      "MATCH (x) where x.hasParent = false return x ORDER BY x."+orderByColumn+ " "+orderBy+" SKIP "+skip+" LIMIT "+limit+" ;",
    );
    let arr = [];
    for (let i=0; i<result["records"].length; i++) {
       arr.push(result["records"][i]["_fields"][0]);
    }
    const pagination = { count: coun, page: pg, limit: lmt };
    const classification = [];
    classification.push(arr);
    classification.push(pagination);
    return classification;
  }

  async create(createClassificationDto: CreateClassificationDto) {
     const classification = new Classification();
     classification.name = createClassificationDto.name;
     classification.code = createClassificationDto.code;
     classification.label = classification.code+' . '+classification.name;
     classification.labelclass = createClassificationDto.labelclass;
     if (createClassificationDto.key) {
       classification.key = createClassificationDto.key
     }
     if (createClassificationDto.tag) {
      classification.tag = createClassificationDto.tag;
     }  
     
     
    if (createClassificationDto.parent_id) {
      let a = "(x:"+createClassificationDto.labelclass+" {name:'"+classification.name+
                              "',code:'"+classification.code+"',key:'"+classification.key+"', hasParent:"+classification.hasParent+
                              ", tag:"+JSON.stringify(classification.tag)+",label:'"+classification.label+"', labelclass:'"+classification.labelclass+
                              "', createdAt:'"+classification.createdAt+"', updatedAt:'"+classification.updatedAt+"'})";
      a = "match (y:"+createClassificationDto.labelclass+") where id(y)="+createClassificationDto.parent_id + " create (y)-[:CHILDREN]->"+a;
       let result = await this.neo4jService.write(
        a
      );
      await this.neo4jService.write(
        "match (x:"+createClassificationDto.labelclass+" {key:'"+classification.key+"'}) set x.self_id = id(x)"
      );
      let b = "match (x:"+createClassificationDto.labelclass+" {code: '"+classification.code+"'})"+
             " match (y:"+createClassificationDto.labelclass+") where id(y)="+createClassificationDto.parent_id +
             " create (x)-[:CHILD_OF]->(y)";
      result = await this.neo4jService.write(
          b
      );       
      return new Classification;
    }
    else {
       classification.hasParent = false;
       let a = "CREATE (x:"+createClassificationDto.labelclass+" {name:'"+
                     classification.name+"',code:'"+classification.code+ "',key:'"+classification.key+"', hasParent:"+classification.hasParent+
                     ", tag:"+JSON.stringify(classification.tag)+",label:'"+classification.label+"', labelclass:'"+classification.labelclass+
                     "', createdAt:'"+classification.createdAt+"', updatedAt:'"+classification.updatedAt+"'})";
                     
         const result = await this.neo4jService.write(
         a
      );
      await this.neo4jService.write(
        "match (x:"+createClassificationDto.labelclass+" {key:'"+classification.key+"'}) set x.self_id = id(x)"
      );
      return  new Classification;
    }
  }
  async update(_id: string, updateClassificationto: UpdateClassificationDto) {
    let res = await this.neo4jService.read("MATCH (p) where id(p)="+_id+" return count(p)");
    if (parseInt(JSON.stringify(res.records[0]["_fields"][0]["low"])) > 0) {
      res = await this.neo4jService.write("MATCH (c) where id(c)="+_id+" set c.code='"+updateClassificationto.code+"', c.name='"+updateClassificationto.name+
                                          "', c.tag="+ JSON.stringify(updateClassificationto.tag)+", c.label='"+
                                          updateClassificationto.code+" . "+updateClassificationto.name+"'");
      console.log("Node updated ................... ");
      return  new Classification;
    }
    else{
      console.log("Can not find a node for update  ....................");
      return  new Classification;
    }
  }
  async delete(_id: string) {
    let res = await this.neo4jService.read("MATCH (c)  -[r:CHILDREN]->(p) where id(c)="+_id+" return count(p)");
    if (parseInt(JSON.stringify(res.records[0]["_fields"][0]["low"])) > 0) {
      console.log("Can not delete a node include children ....................");
      return  new Classification;
    }
    else{
      res = await this.neo4jService.write("MATCH (c) where id(c)="+_id+" detach delete c");
      console.log("Node deleted ................... ");
      return  new Classification;
    }
    
  }
}
