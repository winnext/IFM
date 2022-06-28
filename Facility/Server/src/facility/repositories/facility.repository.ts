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
    await this.neo4jService.addRelations(
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
 
}
