/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FacilityNotFountException } from '../../common/notFoundExceptions/not.found.exception';
import { CreateFacilityDto } from '../dtos/create.facility.dto';
import { UpdateFacilityDto } from '../dtos/update.facility.dto';
import { Facility } from '../entities/facility.entity';
import { FacilityStructuresService } from 'src/facility-structures/facility-structures.service';
import { CreateFacilityStructureDto } from 'src/facility-structures/dto/create-facility-structure.dto';
import { BaseInterfaceRepository } from 'src/common/interface/base.facility.interface';
import { Neo4jService } from 'src/sgnm-neo4j/src';
import { assignDtoPropToEntity } from 'sgnm-neo4j/dist';
import { createDynamicCyperCreateQuery } from 'src/common/func/neo4js.func';

@Injectable()
export class FacilityRepository implements BaseInterfaceRepository<Facility> {
  constructor(
    private facilityStructureService: FacilityStructuresService,
    private readonly neo4jService: Neo4jService,
  ) {}

  async findOneByRealm(realm: string): Promise<Facility> {
    const facility = new Facility();
    return facility;
  }

  async create(createFacilityDto: CreateFacilityDto) {
    const facility = new Facility();
    const structure = new Facility();
    const asset = new Facility();
    const { structureInfo, facilityInfo, assetInfo, realm } = createFacilityDto;

    const finalFacilityObject = assignDtoPropToEntity(facility, facilityInfo);
    const finalStructureObject = assignDtoPropToEntity(structure, structureInfo);
    const finalAssetObject = assignDtoPropToEntity(asset, assetInfo);
    const facilityQuery = createDynamicCyperCreateQuery(finalFacilityObject, [realm, 'Root']);
    const structureQuery = createDynamicCyperCreateQuery(finalStructureObject, [realm, 'Structure']);
    const assetQuery = createDynamicCyperCreateQuery(finalAssetObject, [realm, 'Asset']);

    //create  node with multi or single label cyper query
    const facilityNode = await this.neo4jService.write(facilityQuery, finalFacilityObject);
    const structureNode = await this.neo4jService.write(structureQuery, finalStructureObject);
    const assetNode = await this.neo4jService.write(assetQuery, finalAssetObject);
    console.log(structureNode['records'][0]['_fields'][0].identity.low);
    await this.neo4jService.addRelations(
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
    return 'updatedFacility';
  }

  async findOneById(id: string): Promise<any> {
    return 'facility';
  }
}
