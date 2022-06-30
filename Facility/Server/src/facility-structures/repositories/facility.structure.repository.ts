import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FacilityStructureNotFountException } from '../../common/notFoundExceptions/not.found.exception';

import { CreateFacilityStructureDto } from '../dto/create-facility-structure.dto';
import { UpdateFacilityStructureDto } from '../dto/update-facility-structure.dto';
import { FacilityStructure } from '../entities/facility-structure.entity';

//import { CustomNeo4jError, Neo4jService } from 'sgnm-neo4j';
import { CustomNeo4jError, Neo4jService } from 'src/sgnm-neo4j/src';

import { int, RxTransaction } from 'neo4j-driver';
import { PaginationNeo4jParams } from 'src/common/commonDto/pagination.neo4j.dto';
import { BaseGraphDatabaseInterfaceRepository, nodeHasChildException } from 'ifmcommon';
import { assignDtoPropToEntity, createDynamicCyperCreateQuery, createDynamicCyperObject } from 'src/common/func/neo4js.func';
import { Neo4jLabelEnum } from 'src/common/const/neo4j.label.enum';
import { create_node__must_entered_error, create_node__node_not_created_error, create__must_entered_error } from 'src/sgnm-neo4j/src/constant/custom.error.object';
import { newError } from 'neo4j-driver-core';
import { GeciciInterface } from 'src/common/interface/gecici.interface';


@Injectable()
export class FacilityStructureRepository implements GeciciInterface<FacilityStructure> {
  constructor(private readonly neo4jService: Neo4jService) {}

  async findOneByRealm(label: string, realm: string) {
    const node = await this.neo4jService.findByRealmWithTreeStructure(label, realm); 
    if (!node) {
      throw new FacilityStructureNotFountException(realm);
    }
    node['root']['children']=node['root']['child_of'];
    delete node['root']['child_of'];

    return node;
  }
  async create(createFacilityStructureDto: CreateFacilityStructureDto) {
    let facilityStructure = new FacilityStructure();
    let facilityStructureObject = assignDtoPropToEntity(facilityStructure, createFacilityStructureDto);
    let value;
    if (facilityStructureObject['labels']) {
      value = await this.neo4jService.createNode(facilityStructureObject['entity'], facilityStructureObject['labels']);
    }
    else {
      value = await this.neo4jService.createNode(facilityStructureObject['entity']);
    }
    value['properties']['id'] = value['identity'].low;
    const result = {id:value['identity'].low, labels: value['labels'], properties: value['properties']}
    if (facilityStructureObject['parentId']) {
      await this.neo4jService.addRelations(
        result['id'], createFacilityStructureDto["parentId"]
      );
    }
    return result;
  }
  

  async update(_id: string, updateFacilityStructureDto: UpdateFacilityStructureDto) {
    let updateFacilityStructureDtoWithoutLabelsAndParentId = {};
    Object.keys(updateFacilityStructureDto).forEach((element) => {
      if (element != 'labels' && element != 'parentId' ) {
        updateFacilityStructureDtoWithoutLabelsAndParentId[element] = updateFacilityStructureDto[element];
      }
    });
    const dynamicObject = createDynamicCyperObject(updateFacilityStructureDtoWithoutLabelsAndParentId);
    const updatedNode = await this.neo4jService.updateById(_id, dynamicObject);

    if (!updatedNode) {
      throw new FacilityStructureNotFountException(_id);
    }
    const result = {id:updatedNode['identity'].low, labels: updatedNode['labels'], properties: updatedNode['properties']} 
    if (updateFacilityStructureDto['labels'] && updateFacilityStructureDto['labels'].length > 0) {   
      await this.neo4jService.removeLabel(_id,result["labels"]);
      await this.neo4jService.updateLabel(_id,updateFacilityStructureDto['labels']);
    }
    return result;
  }

  async delete(_id: string) {
    try {
     
      let hasParent = await this.neo4jService.getParentById(_id);
      let deletedNode;
      if (hasParent['records'].length > 0) {
         let hasChildren =  await this.neo4jService.findChildrenById(_id);       
         if (hasChildren['records'].length == 0) {
           deletedNode = await this.neo4jService.delete(_id);
           if (!deletedNode) {
             throw new FacilityStructureNotFountException(_id);
          }
         }
      }
      return deletedNode;
    } catch (error) {
      const { code, message } = error.response;
      if (code === CustomNeo4jError.HAS_CHILDREN) {
        nodeHasChildException(_id);
      } else {
        throw new HttpException(message, code);
      }
    }
  }

  async changeNodeBranch(_id: string, _target_parent_id: string) {
    try {
      await this.neo4jService.deleteRelations(_id);
      await this.neo4jService.addRelations(_id, _target_parent_id);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteRelations(_id: string) {
    await this.neo4jService.deleteRelations(_id);
  }

  async addRelations(_id: string, _target_parent_id: string) {
    try {
      await this.neo4jService.addRelations(_id, _target_parent_id);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOneNodeByKey(key: string) {
    try {
      const node = await this.neo4jService.findOneNodeByKey(key);
      if (!node) {
        throw new FacilityStructureNotFountException(key);
      }
      const result = {id:node['identity'].low, labels: node['labels'], properties: node['properties']} 
      return result;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
