import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Neo4jService } from 'nest-neo4j/dist';
import { PaginationParams } from 'src/common/commonDto/pagination.dto';
import { ClassificationNotFountException } from 'src/common/notFoundExceptions/facility.not.found.exception';
import { BaseInterfaceRepository } from 'src/common/repositories/crud.repository.interface';
import { CreateClassificationDto } from '../dto/create-classification.dto';
import { UpdateClassificationDto } from '../dto/update-classification.dto';

import { Classification } from '../entities/classification.entity';

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
    const result = await this.neo4jService.read(
      "MATCH p=(n)-[:CHILDREN*]->(m) where id(n)="+id+" \
      WITH COLLECT(p) AS ps \
      CALL apoc.convert.toTree(ps) yield value \
      RETURN value;",
    );
    if (!result) {
      throw new ClassificationNotFountException(id);
    } 
    
    return result["records"][0]["_fields"];
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
      `MATCH (c) where c.code in ['11-00-00-00','12-00-00-00'] RETURN count(c)`,
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
      "MATCH (x) where x.code in ['11-00-00-00','12-00-00-00'] return x ORDER BY x."+orderByColumn+ " "+orderBy+" SKIP "+skip+" LIMIT "+limit+" ;",
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
    const classification = new this.classificationModel(createClassificationDto);

    return await classification.save();
  }
  async update(_id: string, updateClassificationto: UpdateClassificationDto) {
    const updatedFacility = await this.classificationModel
      .findOneAndUpdate({ _id }, { $set: updateClassificationto }, { new: true })
      .exec();

    if (!updatedFacility) {
      throw new ClassificationNotFountException(_id);
    }

    return updatedFacility;
  }
  async delete(_id: string) {
    const classification = await this.findOneById(_id);
    return this.classificationModel.remove(classification);
  }
}
