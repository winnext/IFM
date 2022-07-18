import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  AssetNotFoundException,
  FacilityStructureNotFountException,
} from '../../common/notFoundExceptions/not.found.exception';
import { Asset } from '../entities/asset.entity';
import { assignDtoPropToEntity, createDynamicCyperObject, CustomNeo4jError, Neo4jService } from 'src/sgnm-neo4j/src';
import { NestKafkaService, nodeHasChildException } from 'ifmcommon';
import { GeciciInterface } from 'src/common/interface/gecici.interface';
import { CreateAssetDto } from '../dto/create-asset.dto';
import { UpdateAssetDto } from '../dto/update-asset.dto';
import { find_one_node_by_key_must_entered_error, node_not_found } from 'src/sgnm-neo4j/src/constant/custom.error.object';


@Injectable()
export class AssetRepository implements GeciciInterface<Asset> {
  constructor(private readonly neo4jService: Neo4jService, private readonly kafkaService: NestKafkaService) {}

  async findOneByRealm(label: string, realm: string) {
    let node = await this.neo4jService.findByRealmWithTreeStructure(label, realm);
    if (!node) {
      throw new FacilityStructureNotFountException(realm);
    }
    node = await this.neo4jService.changeObjectChildOfPropToChildren(node);

    return node;
  }
  async create(createAssetDto: CreateAssetDto) {
    const asset = new Asset();
    const assetObject = assignDtoPropToEntity(asset, createAssetDto);
    let value;

    if (createAssetDto['labels']) {
      value = await this.neo4jService.createNode(assetObject, createAssetDto['labels']);
    } else {
      value = await this.neo4jService.createNode(assetObject);
    }
    value['properties']['id'] = value['identity'].low;
    const result = { id: value['identity'].low, labels: value['labels'], properties: value['properties'] };
    console.log(result.id);
    console.log(createAssetDto);
    if (createAssetDto['parentId']) {
      await this.neo4jService.addRelations(String(result['id']), createAssetDto['parentId']);
    }
    return result;
  }

  async update(_id: string, updateAssetDto: UpdateAssetDto) {
    const updateAssetDtoWithoutLabelsAndParentId = {};
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
      const node=await this.neo4jService.read(`match(n) where id(n)=$id return n`,{id:parseInt(_id)})
      if(!node.records[0]){
        throw new HttpException({code:5005},404)
      }
      await this.neo4jService.getParentById(_id);
      let deletedNode;

      const hasChildren = await this.neo4jService.findChildrenById(_id);
  
      if (hasChildren['records'].length == 0) {
        await this.kafkaService.producerSendMessage(
          'deleteAsset',
          JSON.stringify({ referenceKey: node.records[0]['_fields'][0].properties.key }),
        );
        deletedNode = await this.neo4jService.delete(_id);
        if (!deletedNode) {
          throw new AssetNotFoundException(_id);
        }
      }
      await this.kafkaService.producerSendMessage(
        'deleteAsset',
        JSON.stringify({ referenceKey: deletedNode.properties.key }),
      );
      return deletedNode;
    } catch (error) {
      const { code, message } = error.response;
      if (code === CustomNeo4jError.HAS_CHILDREN) {
        nodeHasChildException(_id);
      }else if(code===5005){
        AssetNotFoundException(_id)
      } 
      else {
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

  async findByKey(key: string) {
    const node = await this.findOneNodeByKey1(key);
    if (!node) {
      return null;
    }
    const result = { id: node['identity'].low, labels: node['labels'], properties: node['properties'] };
    return result;
  }


////////////////////////////////////////////////////////////////////////// isDeleted:false koşulu kaldırıldı
  async findOneNodeByKey1(key: string) {
    try {
      if (!key) {
        throw new HttpException(find_one_node_by_key_must_entered_error, 400);
      }
      //find node by key
      const result = await this.neo4jService.read('match (n ) where n.key=$key and NOT n:Virtual return n', { key: key });

      if (result['records'].length==0) {
        throw new HttpException(node_not_found, 404);
      }
      var node = result['records'][0]['_fields'][0];

      return node;
    } catch (error) {
      if (error.response.code) {
        throw new HttpException({ message: error.response.message, code: error.response.code }, error.status);
      }
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }}
}
