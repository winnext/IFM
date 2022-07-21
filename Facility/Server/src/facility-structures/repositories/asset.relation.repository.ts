import { HttpException, Injectable } from '@nestjs/common';
import {
  FacilityStructureNotFountException,
  hasRelationException,
  RelationNotFountException,
} from '../../common/notFoundExceptions/not.found.exception';
import { FacilityStructure } from '../entities/facility-structure.entity';
import { NestKafkaService } from 'ifmcommon';
import { VirtualNodeInterface } from 'src/common/interface/relation.node.interface';
import { CreateAssetRelationDto } from '../dto/asset.relation.dto';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map } from 'rxjs';
import { assignDtoPropToEntity, Neo4jService } from 'sgnm-neo4j/dist';
import { VirtualNode } from 'src/common/baseobject/virtual.node';
import { RelationName } from 'src/common/const/relation.name.enum';
import { StructureService } from '../services/structure.service';

@Injectable()
export class AssetRelationRepository implements VirtualNodeInterface<FacilityStructure> {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly kafkaService: NestKafkaService,
    private readonly httpService: HttpService,
    private readonly structureService: StructureService,
  ) {}

  async findOneNodeByKey(key: string) {
    const node = await this.neo4jService.findOneNodeByKey(key);
    if (!node) {
      //throw new HttpException('uygun node id si giriniz', 400);
      throw new RelationNotFountException(key);
    }

    //find by key with specific relation name which node has that specific relations
    const relations = await this.neo4jService.findNodesByKeyWithRelationName(key, RelationName.HAS);
    console.log(relations);

    if (!relations || relations.length === 0) {
      //throw new HttpException('hiç ilişkisi yok', 400);
      throw new RelationNotFountException(key);
    }

    const assetArray = await Promise.all(
      relations.map(async (virtualAsset) => {
        const asset = await this.httpService
          .get(virtualAsset['_fields'][0].properties.url)
          .pipe(
            catchError(() => {
              throw new HttpException('connection refused due to connection lost or wrong data provided', 502);
            }),
          )
          .pipe(map((response) => response.data));
        return await firstValueFrom(asset);
      }),
    );

    return assetArray;
  }

  async create(key: string, createAssetRelationDto: CreateAssetRelationDto) {
    const node = await this.neo4jService.findOneNodeByKey(key);
    if (!node) {
      //throw new HttpException('uygun node id si giriniz', 400);
      throw new FacilityStructureNotFountException(key);
    }

    const assetObservableObject = await this.httpService
      .get(`${process.env.ASSET_URL}/${createAssetRelationDto.referenceKey}`)
      .pipe(
        catchError(() => {
          throw new HttpException('connection refused due to connection lost or wrong data provided', 502);
        }),
      )
      .pipe(map((response) => response.data));

    const asset = await firstValueFrom(assetObservableObject);

    //ilgili assetin başka bir structureda tanımlı olup olmadığını gösteren query
    const virtualNodeCountInDbByReferenceKey = await this.checkSpecificVirtualNodeCountInDb(
      createAssetRelationDto.referenceKey,
      RelationName.HAS,
    );

    if (virtualNodeCountInDbByReferenceKey.length > 0) {
      throw new HttpException('already has relation with other nodes', 400);
    }

    const relationExistanceBetweenVirtualNodeAndNodeByKey = await this.neo4jService.findNodeByKeysAndRelationName(
      key,
      createAssetRelationDto.referenceKey,
      RelationName.HAS,
    );

    if (relationExistanceBetweenVirtualNodeAndNodeByKey.length > 0) {
      throw new hasRelationException(key);
    }
    let virtualNode = new VirtualNode();

    virtualNode = assignDtoPropToEntity(virtualNode, createAssetRelationDto);
    const assetUrl = `${process.env.ASSET_URL}/${createAssetRelationDto.referenceKey}`;

    virtualNode.url = assetUrl;
    const value = await this.neo4jService.createNode(virtualNode, ['Virtual', 'Asset']);

    await this.neo4jService.addRelationWithRelationNameByKey(key, value.properties.key, RelationName.HAS);
    await this.neo4jService.addRelationWithRelationNameByKey(
      key,
      value.properties.key,
      RelationName.HAS_VIRTUAL_RELATION,
    );

    const structureUrl = `${process.env.STRUCTURE_URL}/${node.properties.key}`;
    const kafkaObject = { referenceKey: key, parentKey: createAssetRelationDto.referenceKey, url: structureUrl };
    await this.kafkaService.producerSendMessage('createStructureAssetRelation', JSON.stringify(kafkaObject));

    const response = { structure: node, asset: asset };

    return response;
  }

  async delete(key: string, referenceKey: string) {
    try {
      await this.structureService.findOneNode(key);

      const assetObservableObject = await this.httpService
        .get(`${process.env.ASSET_URL}/${referenceKey}`)
        .pipe(
          catchError(() => {
            throw new HttpException('connection refused due to connection lost or wrong data provided', 502);
          }),
        )
        .pipe(map((response) => response.data));

      const asset = await firstValueFrom(assetObservableObject);

      //check 2 nodes has a relation
      const relationExistanceBetweenVirtualNodeAndNodeByKey = await this.neo4jService.findNodeByKeysAndRelationName(
        key,
        referenceKey,
        RelationName.HAS,
      );

      if (!relationExistanceBetweenVirtualNodeAndNodeByKey.length) {
        throw new RelationNotFountException(key);
      }

      const virtualAssetNode = relationExistanceBetweenVirtualNodeAndNodeByKey[0]['_fields'][1].properties;
      if (virtualAssetNode.isDeleted) {
        throw new RelationNotFountException(referenceKey);
      }
      const virtualNodeId = relationExistanceBetweenVirtualNodeAndNodeByKey[0]['_fields'][1].identity.low;
      await this.deleteVirtualNode(virtualNodeId);

      await this.kafkaService.producerSendMessage(
        'deleteAssetFromStructure',
        JSON.stringify({ referenceKey: key, key: referenceKey }),
      );

      return asset;
    } catch (error) {
      console.log(error);
      if (error.response?.code) {
      } else {
        throw new HttpException(error.response, error.status);
      }
    }
  }

  //-----------------------------------------------Will Add to sgnm-neo4j library----------------

  async checkSpecificVirtualNodeCountInDb(referenceKey: string, relationName: string) {
    try {
      const node = await this.neo4jService.read(
        `match(p) match (c {referenceKey:$referenceKey,isDeleted:false}) match (p)-[:${relationName}]->(c) return c`,
        { referenceKey },
      );
      return node.records;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async deleteVirtualNode(id: number) {
    try {
      const node = await this.neo4jService.write(`match (n:Virtual ) where id(n)=$id set n.isDeleted=true return n`, {
        id,
      });
      return node.records[0]['_fields'][0];
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}
