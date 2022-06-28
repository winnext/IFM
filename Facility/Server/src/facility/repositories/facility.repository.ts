/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CreateFacilityDto } from '../dtos/create.facility.dto';
import { UpdateFacilityDto } from '../dtos/update.facility.dto';
import { BaseInterfaceRepository } from 'src/common/interface/base.facility.interface';
import { Neo4jService } from 'src/sgnm-neo4j/src';
import { assignDtoPropToEntity } from 'sgnm-neo4j/dist';
import { createDynamicCyperCreateQuery } from 'src/common/func/neo4js.func';
import { Facility } from '../entities/facility.entity';
import { Neo4jLabelEnum } from 'src/common/const/neo4j.label.enum';
import { FacilityNotFountException } from 'src/common/notFoundExceptions/not.found.exception';

@Injectable()
export class FacilityRepository implements BaseInterfaceRepository<Facility> {
  constructor(private readonly neo4jService: Neo4jService) {}

  async findOneByRealm(realm: string): Promise<Facility> {
    const facility = await this.neo4jService.read(`match (n:Root ) where n.realm=$realm return n`, { realm });
    if (!facility['records'][0]) {
      throw FacilityNotFountException(realm);
    }
    return facility['records'][0]['_fields'][0];
  }

  async create(createFacilityDto: CreateFacilityDto) {
    const facility = new Facility();
    //for structure there will be structure entity
    const structure = new Facility();
    //for asset there will be asset entity
    const asset = new Facility();
    const { structureInfo, facilityInfo, assetInfo } = createFacilityDto;

    const finalFacilityObject = assignDtoPropToEntity(facility, facilityInfo);
    const finalStructureObject = assignDtoPropToEntity(structure, structureInfo);
    const finalAssetObject = assignDtoPropToEntity(asset, assetInfo);

    const facilityQuery = createDynamicCyperCreateQuery(finalFacilityObject, [Neo4jLabelEnum.ROOT]);
    const structureQuery = createDynamicCyperCreateQuery(finalStructureObject, [Neo4jLabelEnum.FACILITY_STRUCTURE]);
    const assetQuery = createDynamicCyperCreateQuery(finalAssetObject, [Neo4jLabelEnum.ASSET]);

    //create  node with multi or single label cyper query
    const facilityNode = await this.neo4jService.write(facilityQuery, finalFacilityObject);
    const structureNode = await this.neo4jService.write(structureQuery, finalStructureObject);
    const assetNode = await this.neo4jService.write(assetQuery, finalAssetObject);

    await this.addRelations(
      structureNode['records'][0]['_fields'][0].identity.low,
      facilityNode['records'][0]['_fields'][0].identity.low,
    );
    await this.addRelations(
      assetNode['records'][0]['_fields'][0].identity.low,
      facilityNode['records'][0]['_fields'][0].identity.low,
    );
    return facilityNode['records'][0]['_fields'][0];
  }
  async update(_id: string, updateFacilityDto: UpdateFacilityDto) {
    const updatedFacility = await this.neo4jService.updateById(_id, updateFacilityDto);

    if (!updatedFacility) {
      throw FacilityNotFountException(_id);
    }
    return updatedFacility;
  }

  async findOneById(id: string): Promise<any> {
    return 'facility';
  }

  //-------------------------------------------Neo4jFunctions----------------------------------------------
  async addRelations(_id: string, _target_parent_id: string) {
    try {
      if (!_id || !_target_parent_id) {
        throw new HttpException('id must entered', 400);
      }
      await this.addChildrenRelationById(_id, _target_parent_id);

      await this.neo4jService.addParentRelationById(_id, _target_parent_id);
    } catch (error) {
      if (error.response.code) {
        throw new HttpException({ message: error.response.message, code: error.response.code }, error.status);
      } else {
        throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async addChildrenRelationById(child_id: string, target_parent_id: string) {
    try {
      if (!child_id || !target_parent_id) {
        throw new HttpException('id must entered', 404);
      }
      const res = await this.neo4jService.write(
        'MATCH (c {isDeleted: false}) where id(c)= $id MATCH (p {isDeleted: false}) where id(p)= $target_parent_id  MERGE (p)-[:PARENT_OF]-> (c)',
        { id: parseInt(child_id), target_parent_id: parseInt(target_parent_id) },
      );
      if (!res) {
        throw new HttpException(null, 400);
      }
      return res;
    } catch (error) {
      if (error.response.code) {
        throw new HttpException({ message: error.response.message, code: error.response.code }, error.status);
      } else {
        throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
