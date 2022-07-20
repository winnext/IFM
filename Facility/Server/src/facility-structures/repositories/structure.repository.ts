import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FacilityStructureNotFountException } from '../../common/notFoundExceptions/not.found.exception';
import { CreateFacilityStructureDto } from '../dto/create-facility-structure.dto';
import { UpdateFacilityStructureDto } from '../dto/update-facility-structure.dto';
import { FacilityStructure } from '../entities/facility-structure.entity';
//import { CustomNeo4jError, Neo4jService } from 'sgnm-neo4j';
import { GeciciInterface } from 'src/common/interface/gecici.interface';
import { NestKafkaService, nodeHasChildException } from 'ifmcommon';
import { Neo4jService, assignDtoPropToEntity, createDynamicCyperObject, CustomNeo4jError } from 'sgnm-neo4j/dist';

@Injectable()
export class FacilityStructureRepository implements GeciciInterface<FacilityStructure> {
  constructor(private readonly neo4jService: Neo4jService, private readonly kafkaService: NestKafkaService) {}

  async findOneByRealm(label: string, realm: string) {
    let node = await this.neo4jService.findByRealmWithTreeStructure(label, realm);
    if (!node) {
      throw new FacilityStructureNotFountException(realm);
    }
    node = await this.neo4jService.changeObjectChildOfPropToChildren(node);

    return node;
  }
  async create(createFacilityStructureDto: CreateFacilityStructureDto) {
    const facilityStructure = new FacilityStructure();
    const facilityStructureObject = assignDtoPropToEntity(facilityStructure, createFacilityStructureDto);

    let value;
    if (createFacilityStructureDto['labels']) {
      createFacilityStructureDto.labels.push('FacilityStructure');
      value = await this.neo4jService.createNode(facilityStructureObject, createFacilityStructureDto.labels);
    } else {
      value = await this.neo4jService.createNode(facilityStructureObject, ['FacilityStructure']);
    }
    value['properties']['id'] = value['identity'].low;
    const result = { id: value['identity'].low, labels: value['labels'], properties: value['properties'] };
    if (createFacilityStructureDto['parentId']) {
      await this.neo4jService.addRelations(result['id'], createFacilityStructureDto['parentId']);
    }
    return result;
  }

  async update(_id: string, updateFacilityStructureDto: UpdateFacilityStructureDto) {
    const updateFacilityStructureDtoWithoutLabelsAndParentId = {};
    Object.keys(updateFacilityStructureDto).forEach((element) => {
      if (element != 'labels' && element != 'parentId') {
        updateFacilityStructureDtoWithoutLabelsAndParentId[element] = updateFacilityStructureDto[element];
      }
    });
    const dynamicObject = createDynamicCyperObject(updateFacilityStructureDtoWithoutLabelsAndParentId);
    const updatedNode = await this.neo4jService.updateById(_id, dynamicObject);

    if (!updatedNode) {
      throw new FacilityStructureNotFountException(_id);
    }
    const result = {
      id: updatedNode['identity'].low,
      labels: updatedNode['labels'],
      properties: updatedNode['properties'],
    };
    if (updateFacilityStructureDto['labels'] && updateFacilityStructureDto['labels'].length > 0) {
      await this.neo4jService.removeLabel(_id, result['labels']);
      await this.neo4jService.updateLabel(_id, updateFacilityStructureDto['labels']);
    }
    return result;
  }

  async delete(_id: string) {
    try {
      const node = await this.neo4jService.read(
        `match(n {isDeleted:false}) where id(n)=$id and not n:Virtual return n`,
        { id: parseInt(_id) },
      );
      if (!node.records[0]) {
        throw new HttpException({ code: 5005 }, 404);
      }
      await this.neo4jService.getParentById(_id);
      let deletedNode;

      const hasChildren = await this.neo4jService.findChildrenById(_id);

      if (hasChildren['records'].length == 0) {
        const hasAssetRelation = await this.neo4jService.findNodesWithRelationNameById(_id, 'HAS');
        console.log(hasAssetRelation);
        if (hasAssetRelation.length > 0) {
          await this.kafkaService.producerSendMessage(
            'deleteStructure',
            JSON.stringify({ referenceKey: node.records[0]['_fields'][0].properties.key }),
          );
        }

        deletedNode = await this.neo4jService.delete(_id);
        if (!deletedNode) {
          throw new FacilityStructureNotFountException(_id);
        }
      }

      return deletedNode;
    } catch (error) {
      console.log(error);
      const { code, message } = error.response;
      if (code === CustomNeo4jError.HAS_CHILDREN) {
        nodeHasChildException(_id);
      } else if (code === 5005) {
        FacilityStructureNotFountException(_id);
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
