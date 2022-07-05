import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  AssetNotFoundException,
  FacilityStructureNotFountException,
} from '../../common/notFoundExceptions/not.found.exception';

import { Asset } from '../entities/asset.entity';

//import { CustomNeo4jError, Neo4jService } from 'sgnm-neo4j';
import { assignDtoPropToEntity, createDynamicCyperObject, CustomNeo4jError, Neo4jService } from 'src/sgnm-neo4j/src';

import { BaseGraphDatabaseInterfaceRepository, nodeHasChildException } from 'ifmcommon';
import { GeciciInterface } from 'src/common/interface/gecici.interface';
import { CreateAssetDto } from '../dto/create-asset.dto';
import { UpdateAssetDto } from '../dto/update-asset.dto';

@Injectable()
export class AssetRepository implements GeciciInterface<Asset> {
  constructor(private readonly neo4jService: Neo4jService) {}

  async findOneByRealm(label: string, realm: string) {
    let node = await this.neo4jService.findByRealmWithTreeStructure(label, realm);
    if (!node) {
      throw new FacilityStructureNotFountException(realm);
    }
    node = await this.neo4jService.changeObjectChildOfPropToChildren(node);

    return node;
  }
  async create(createAssetDto: CreateAssetDto) {
    let asset = new Asset();
    let assetObject = assignDtoPropToEntity(asset, createAssetDto);
    let value;
    if (assetObject['labels']) {
      value = await this.neo4jService.createNode(assetObject, assetObject['labels']);
    } else {
      value = await this.neo4jService.createNode(assetObject);
    }
    value['properties']['id'] = value['identity'].low;
    const result = { id: value['identity'].low, labels: value['labels'], properties: value['properties'] };
    if (assetObject['parentId']) {
      await this.neo4jService.addRelations(result['id'], CreateAssetDto['parentId']);
    }
    return result;
  }

  async update(_id: string, updateAssetDto: UpdateAssetDto) {
    let updateAssetDtoWithoutLabelsAndParentId = {};
    Object.keys(updateAssetDto).forEach((element) => {
      if (element != 'labels' && element != 'parentId') {
        updateAssetDtoWithoutLabelsAndParentId[element] = updateAssetDto[element];
      }
    });
    const dynamicObject = createDynamicCyperObject(updateAssetDtoWithoutLabelsAndParentId);
    const updatedNode = await this.neo4jService.updateById(_id, dynamicObject);

    if (!updatedNode) {
      throw new FacilityStructureNotFountException(_id);
    }
    const result = {
      id: updatedNode['identity'].low,
      labels: updatedNode['labels'],
      properties: updatedNode['properties'],
    };
    if (updateAssetDto['labels'] && updateAssetDto['labels'].length > 0) {
      await this.neo4jService.removeLabel(_id, result['labels']);
      await this.neo4jService.updateLabel(_id, updateAssetDto['labels']);
    }
    return result;
  }

  async delete(_id: string) {
    try {
      let hasParent = await this.neo4jService.getParentById(_id);
      let deletedNode;

      let hasChildren = await this.neo4jService.findChildrenById(_id);
      if (hasChildren['records'].length == 0) {
        deletedNode = await this.neo4jService.delete(_id);
        if (!deletedNode) {
          throw new AssetNotFoundException(_id);
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
        throw new AssetNotFoundException(key);
      }
      const result = { id: node['identity'].low, labels: node['labels'], properties: node['properties'] };
      return result;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOneNodeById(id: string) {
    try {
      const node = await this.neo4jService.read(`match (n) where id(n)= $id return n`, { id: parseInt(id) });
      if (!node) {
        throw new AssetNotFoundException(id);
      }
      const result = {
        id: node.records[0]['_fields'][0]['identity'].low,
        labels: node.records[0]['_fields'][0]['labels'],
        properties: node.records[0]['_fields'][0]['properties'],
      };
      return result;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
