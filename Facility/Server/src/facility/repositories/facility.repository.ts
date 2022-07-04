/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CreateFacilityDto } from '../dtos/create.facility.dto';
import { UpdateFacilityDto } from '../dtos/update.facility.dto';
import { BaseInterfaceRepository } from 'src/common/interface/base.facility.interface';
import { assignDtoPropToEntity, createDynamicCyperCreateQuery, Neo4jService } from 'src/sgnm-neo4j/src';


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
    const classification = new Facility();
    const { structureInfo, facilityInfo, classificationInfo } = createFacilityDto;

    const finalFacilityObject = assignDtoPropToEntity(facility, facilityInfo);
    const finalStructureObject = assignDtoPropToEntity(structure, structureInfo);
    const finalClassificationObject = assignDtoPropToEntity(classification, classificationInfo);

    const facilityQuery = createDynamicCyperCreateQuery(finalFacilityObject, [Neo4jLabelEnum.ROOT]);
    const structureQuery = createDynamicCyperCreateQuery(finalStructureObject, [Neo4jLabelEnum.FACILITY_STRUCTURE]);
    const classificationQuery = createDynamicCyperCreateQuery(finalClassificationObject, [Neo4jLabelEnum.CLASSIFICATION]);

    //create  node with multi or single label cyper query
    const facilityNode = await this.neo4jService.write(facilityQuery, finalFacilityObject);
    const structureNode = await this.neo4jService.write(structureQuery, finalStructureObject);
    const classificationNode = await this.neo4jService.write(classificationQuery, finalClassificationObject);

    await this.neo4jService.addRelations(
      structureNode['records'][0]['_fields'][0].identity.low,
      facilityNode['records'][0]['_fields'][0].identity.low,
    );
    await this.neo4jService.addRelations(
      classificationNode['records'][0]['_fields'][0].identity.low,
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

}
