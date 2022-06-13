import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FacilityStructureNotFountException } from '../../common/notFoundExceptions/not.found.exception';

import { CreateFacilityStructureDto } from '../dto/create-facility-structure.dto';
import { UpdateFacilityStructureDto } from '../dto/update-facility-structure.dto';
import { FacilityStructure } from '../entities/facility-structure.entity';

//import { CustomNeo4jError, Neo4jService } from 'sgnm-neo4j';
import { CustomNeo4jError, Neo4jService } from 'src/sgnm-neo4j/src';

import { int } from 'neo4j-driver';
import { PaginationNeo4jParams } from 'src/common/commonDto/pagination.neo4j.dto';
import { BaseGraphDatabaseInterfaceRepository, nodeHasChildException } from 'ifmcommon';
import { assignDtoPropToEntity, createDynamicCyperObject } from 'src/common/func/neo4js.func';
import { Neo4jLabelEnum } from 'src/common/const/neo4j.label.enum';



@Injectable()
export class FacilityStructureRepository implements BaseGraphDatabaseInterfaceRepository<FacilityStructure> {
  constructor(private readonly neo4jService: Neo4jService) {}

  async findOneById(id: string) {
    const node = await this.neo4jService.findByRealmWithTreeStructure(id);
    
    if (!node) {
      throw new FacilityStructureNotFountException(id);
    }
    return node;
  }

  async findAll(data: PaginationNeo4jParams) {
    const nodes = await this.neo4jService.findAllByClassName(data);

    return nodes;
  }

  async create(createFacilityStructureDto: CreateFacilityStructureDto) {
    let facilityStructure = new FacilityStructure();

    facilityStructure = assignDtoPropToEntity(facilityStructure, createFacilityStructureDto);

    const value = await this.neo4jService.create(facilityStructure, Neo4jLabelEnum.FACILITY_STRUCTURE);
    if (createFacilityStructureDto.optionalLabels && createFacilityStructureDto["optionalLabels"].length > 0) {
      this.neo4jService.updateOptionalLabel(value["identity"].low, createFacilityStructureDto["optionalLabels"][0]);
    }

    return value;
  }

  async update(_id: string, updateFacilityStructureDto: UpdateFacilityStructureDto) {
    const node_old = await this.neo4jService.findById(_id);
    const dynamicObject = createDynamicCyperObject(updateFacilityStructureDto);
    dynamicObject['id'] = int(_id);
    const updatedNode = await this.neo4jService.updateById(_id, dynamicObject);
    if (!updatedNode) {
      throw new FacilityStructureNotFountException(_id);
    }
    
    if ( node_old["properties"]["optionalLabel"]) {
      await this.neo4jService.removeLabel(_id,node_old["properties"]["optionalLabel"]);
    }

    if (updatedNode["properties"]["optionalLabel"]) {
      await this.neo4jService.updateLabel(_id,updatedNode["properties"]["optionalLabel"]);
    }
    
    return updatedNode;
  }

  async delete(_id: string) {
    try {
      const node = await this.neo4jService.findById(_id);
      if (!node.properties.hasParent) {
        throw new HttpException({ message: 'root node cannot deleted', code: 400 }, HttpStatus.BAD_REQUEST);
      }

      const deletedNode = await this.neo4jService.delete(_id);
      if (!deletedNode) {
        throw new FacilityStructureNotFountException(_id);
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
      return node;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
