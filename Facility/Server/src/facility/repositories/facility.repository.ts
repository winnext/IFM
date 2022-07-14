/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateFacilityDto } from '../dtos/create.facility.dto';
import { UpdateFacilityDto } from '../dtos/update.facility.dto';
import { BaseInterfaceRepository } from 'src/common/interface/base.facility.interface';
import { assignDtoPropToEntity, createDynamicCyperCreateQuery, Neo4jService } from 'src/sgnm-neo4j/src';
import { Facility } from '../entities/facility.entity';
import { Neo4jLabelEnum } from 'src/common/const/neo4j.label.enum';
import { FacilityNotFountException } from 'src/common/notFoundExceptions/not.found.exception';
import { NestKafkaService } from 'ifmcommon';

@Injectable()
export class FacilityRepository implements BaseInterfaceRepository<Facility> {
  constructor(private readonly neo4jService: Neo4jService, private readonly kafkaService: NestKafkaService) {}

  async findOneByRealm(realm: string): Promise<Facility> {
    const facility = await this.neo4jService.read(`match (n:Root ) where n.realm=$realm return n`, { realm });
    if (!facility['records'][0]) {
      throw FacilityNotFountException(realm);
    }
    return facility['records'][0]['_fields'][0];
  }

  async create(createFacilityDto: CreateFacilityDto) {
    const { structureInfo, facilityInfo, classificationInfo } = createFacilityDto;

    const facility = new Facility();
    const structure = new Facility();
    const classification = new Facility();

    const finalFacilityObject = assignDtoPropToEntity(facility, facilityInfo);
    const finalStructureObject = assignDtoPropToEntity(structure, structureInfo);
    const finalClassificationObject = assignDtoPropToEntity(classification, classificationInfo);

    //create  node with multi or single label 
    const facilityNode = await this.neo4jService.createNode( finalFacilityObject,[Neo4jLabelEnum.ROOT]);
    const structureNode = await this.neo4jService.createNode( finalStructureObject, [Neo4jLabelEnum.FACILITY_STRUCTURE]);
    const classificationNode = await this.neo4jService.createNode(finalClassificationObject,  [Neo4jLabelEnum.CLASSIFICATION]);

    await this.neo4jService.addRelations(
      structureNode.identity.low,
      facilityNode.identity.low,
    );
    await this.neo4jService.addRelations(
      classificationNode.identity.low,
      facilityNode.identity.low,
    );
    await this.kafkaService.producerSendMessage('createFacility',JSON.stringify(facilityInfo))
    return facilityNode;
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
