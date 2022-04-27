import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationParams } from 'src/common/commonDto/pagination.dto';
import { checkObjectIddİsValid } from 'ifmcommon';
import {
  FacilityNotFountException,
  FacilityStructureNotFountException,
} from '../../common/notFoundExceptions/not.found.exception';
import { CreateFacilityStructureDto } from '../dto/create-facility-structure.dto';
import { UpdateFacilityStructureDto } from '../dto/update-facility-structure.dto';
import { FacilityStructure } from '../entities/facility-structure.entity';
import { Neo4jService } from 'nest-neo4j/dist';
import { int } from 'neo4j-driver';
import { BaseGraphDatabaseInterfaceRepository } from 'ifmcommon';

@Injectable()
export class FacilityStructureRepository implements BaseGraphDatabaseInterfaceRepository<FacilityStructure> {
  constructor(
    private readonly neo4jService: Neo4jService,
    @InjectModel(FacilityStructure.name)
    private readonly facilityStructureModel: Model<FacilityStructure>,
  ) {}
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

    const x = result['records'][0]['_fields'][0];
    if (!result) {
      throw new FacilityStructureNotFountException(id);
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
    let { page, limit } = data;
    page = page || 0;
    limit = limit || 5;
    const orderBy = data.orderBy || 'ascending';
    const orderByColumn = data.orderByColumn || 'FacilityName';

    const count = parseInt((await this.facilityStructureModel.find().count()).toString());
    const pagecount = Math.ceil(count / limit);
    let pg = parseInt(page.toString());
    const lmt = parseInt(limit.toString());
    if (pg > pagecount) {
      pg = pagecount;
    }
    let skip = pg * lmt;
    if (skip >= count) {
      skip = count - lmt;
      if (skip < 0) {
        skip = 0;
      }
    }
    const result = await this.facilityStructureModel
      .find()
      .skip(skip)
      .limit(lmt)
      .sort([[orderByColumn, orderBy]])
      .exec();
    const pagination = { count: count, page: pg, limit: lmt };
    const facility = [];
    facility.push(result);
    facility.push(pagination);

    return facility;
  }

  async create(createFacilityStructureDto: CreateFacilityStructureDto) {
    const { facility_id } = createFacilityStructureDto;

    checkObjectIddİsValid(facility_id);

    const facilityStructure = new this.facilityStructureModel(createFacilityStructureDto);
    return await facilityStructure.save();
  }
  async update(_id: string, updateFacilityStructureDto: UpdateFacilityStructureDto) {
    const updatedFacilityStructure = await this.facilityStructureModel
      .findOneAndUpdate({ _id }, { $set: updateFacilityStructureDto }, { new: true })
      .exec();

    if (!updatedFacilityStructure) {
      throw new FacilityNotFountException(_id);
    }

    return updatedFacilityStructure;
  }
  async delete(_id: string) {
    const facilityStructure = await this.findOneById(_id);
    return this.facilityStructureModel.remove(facilityStructure);
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async changeNodeBranch(_id: string, _target_parent_id: string) {
    // await this.deleteRelations(_id);
    // await this.addRelations(_id, _target_parent_id);
    // return new Classification();
    return null;
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
    const result = await this.neo4jService.read('match (n {key:$key})  return n', { key: key });

    const x = result['records'][0]['_fields'][0];
    if (!result) {
      throw null; //new ClassificationNotFountException(key);
    } else {
      return x;
    }
  }
}
