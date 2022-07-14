import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  FacilityStructureNotFountException,
  hasRelationException,
  RelationNotFountException,
} from '../../common/notFoundExceptions/not.found.exception';
import { FacilityStructure } from '../entities/facility-structure.entity';
import { CustomNeo4jError, Neo4jService } from 'src/sgnm-neo4j/src';
import { NestKafkaService, nodeHasChildException } from 'ifmcommon';
import { VirtualNodeInterface } from 'src/common/interface/relation.node.interface';
import { CreateAssetRelationDto } from '../dto/asset.relation.dto';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map } from 'rxjs';
import { assignDtoPropToEntity } from 'sgnm-neo4j/dist';
import { VirtualNode } from 'src/common/baseobject/virtual.node';
import {
  add_relation_with_relation_name__create_relation_error,
  add_relation_with_relation_name__must_entered_error,
} from 'src/sgnm-neo4j/src/constant/custom.error.object';
import { successResponse } from 'src/sgnm-neo4j/src/constant/success.response.object';

@Injectable()
export class AssetRelationRepository implements VirtualNodeInterface<FacilityStructure> {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly kafkaService: NestKafkaService,
    private readonly httpService: HttpService,
  ) { }

  async findOneNodeByKey(key: string) {
    const node = await this.findByKey(key)
    if (!node) {
      //throw new HttpException('uygun node id si giriniz', 400);
      throw new RelationNotFountException(key);
    }

    //find by key with specific relation name which node has that specific relations
    const relations = await this.findRelationsByKeyWithRelationName(key,'HAS')

    
    if (relations.length === 0) {
      //throw new HttpException('hiç ilişkisi yok', 400);
      throw new RelationNotFountException(key);
    }

    const assetArray = await Promise.all(
      relations.map(async (virtualAsset) => {
        const asset = await this.httpService.get(virtualAsset['_fields'][0].properties.url) .pipe(
          catchError(() => {
            throw new HttpException('connection refused due to connection lost or wrong data provided', 502);
          }),
        ).pipe(map((response) => response.data));
        return await firstValueFrom(asset);
      }),
    );

    return assetArray;
  }

  async create(key: string, createAssetRelationDto: CreateAssetRelationDto) {
    const node = await this.findByKey(key)
    if (!node) {
      //throw new HttpException('uygun node id si giriniz', 400);
      throw new FacilityStructureNotFountException(key);
    }

    const assetPromise = await this.httpService
      .get(`${process.env.ASSET_URL}/${createAssetRelationDto.referenceKey}`)
      .pipe(
        catchError(() => {
          throw new HttpException('connection refused due to connection lost or wrong data provided', 502);
        }),
      )
      .pipe(map((response) => response.data));
    const asset = await firstValueFrom(assetPromise);
   
    if (!asset) {
      return 'asset not found';
    }
    const relationExist = await this.neo4jService.read(
      `match(p {isDeleted:false}) where p.key=$key match (c) where c.referenceKey=$referenceKey match (p)-[:HAS]->(c) return c`,
      {
        key,
        referenceKey: createAssetRelationDto.referenceKey,
      },
    );

    if (relationExist.records[0] && relationExist.records[0].length > 0) {
      //throw new HttpException('this relation exist', 400);
      throw new hasRelationException(key);
    }

    let virtualNode = new VirtualNode();

    virtualNode = assignDtoPropToEntity(virtualNode, createAssetRelationDto);
    const assetUrl = `${process.env.ASSET_URL}/${createAssetRelationDto.referenceKey}`;

    virtualNode['url'] = assetUrl;
    const value = await this.neo4jService.createNode(virtualNode, ['Virtual', 'Asset']);

    //  value['properties']['id'] = value['identity'].low;
    // const result = { id: value['identity'].low, labels: value['labels'], properties: value['properties'] };
    console.log(value.properties.key);
    await this.addRelationWithRelationNameByKey(key, value.properties.key, 'HAS');

    await this.addRelationWithRelationNameByKey(key, value.properties.key, 'HAS_VİRTUAL_RELATION');

    const structureUrl = `${process.env.STRUCTURE_URL}/${node.properties.key}`;
    const kafkaObject = { referenceKey: key, parentKey: createAssetRelationDto.referenceKey, url: structureUrl };
    await this.kafkaService.producerSendMessage('createStructureAssetRelation', JSON.stringify(kafkaObject));

    return 'succes';
  }

  async delete(_id: string) {
    try {
      let deletedNode;

      const hasChildren = await this.neo4jService.findChildrenById(_id);
      if (hasChildren['records'].length == 0) {
        deletedNode = await this.neo4jService.delete(_id);
        if (!deletedNode) {
          throw new FacilityStructureNotFountException(_id);
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

  

  //---------------------------------------------------------
  async addRelationWithRelationNameByKey(first_node_key, second_node_key, relationName) {
    try {
      if (!first_node_key || !second_node_key || !relationName) {
        throw new HttpException(add_relation_with_relation_name__must_entered_error, 400);
      }

      const res = await this.neo4jService.write(
        `MATCH (c {isDeleted: false}) where c.key= $first_node_key MATCH (p {isDeleted: false}) where p.key= $second_node_key MERGE (c)-[:${relationName}]-> (p)`,
        {
          first_node_key,
          second_node_key,
        },
      );
      const { relationshipsCreated } = await res.summary.updateStatistics.updates();
      if (relationshipsCreated === 0) {
        throw new HttpException(add_relation_with_relation_name__create_relation_error, 400);
      }
      return successResponse(res);
    } catch (error) {
      if (error?.response?.code) {
        throw new HttpException({ message: error.response?.message, code: error.response?.code }, error.status);
      } else {
        throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async findByKey(key: string) {

    if (!key) {
      throw new HttpException('id must entered', 400)
    }
    const node = await this.neo4jService.read(`match(p {key:$key,isDeleted:false}) where NOT p:Virtual  return p`, {
      key,
    });
    if (!node.records[0]) {
      //throw new HttpException('uygun node id si giriniz', 400);
      return null
    }
    return node.records[0]['_fields'][0]
  }

  async findRelationsByKeyWithRelationName(key:string,relationName:string){

    const relations = await this.neo4jService.read(
      `match(p {key:$key}) match (c) where c.isDeleted=false match (p)-[:${relationName}]->(c) return c`,
      {
        key,
      },
    );
  
    if (relations.records.length === 0) {
      //throw new HttpException('hiç ilişkisi yok', 400);
      throw new RelationNotFountException(key);
    }

    return relations.records

  }
}
