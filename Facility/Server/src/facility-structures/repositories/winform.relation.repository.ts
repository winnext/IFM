import { HttpException, Injectable } from '@nestjs/common';
import {
  FacilityStructureNotFountException,
  hasRelationException,
  RelationNotFountException,
} from '../../common/notFoundExceptions/not.found.exception';
import { FacilityStructure } from '../entities/facility-structure.entity';
import { NestKafkaService } from 'ifmcommon';
import { VirtualNodeInterface } from 'src/common/interface/relation.node.interface';

import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map } from 'rxjs';
import { assignDtoPropToEntity, Neo4jService } from 'sgnm-neo4j/dist';
import { VirtualNode } from 'src/common/baseobject/virtual.node';
import { CreateWinformRelationDto } from '../dto/winform.relation.dto';

import { RelationName } from 'src/common/const/relation.name.enum';
import { Neo4jLabelEnum } from 'src/common/const/neo4j.label.enum';

@Injectable()
export class WinformRelationRepository implements VirtualNodeInterface<FacilityStructure> {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly kafkaService: NestKafkaService,
    private readonly httpService: HttpService,
  ) {}

  async findOneNodeByKey(key: string) {
    const node = await this.neo4jService.findOneNodeByKey(key);
    if (!node) {
      //throw new HttpException('uygun node id si giriniz', 400);
      throw new RelationNotFountException(key);
    }

    //find by key with specific relation name which node has that specific relations
    const relations = await this.neo4jService.findNodesByKeyWithRelationName(key, RelationName.HAS_FORM);

    if (!relations || relations.length === 0) {
      //throw new HttpException('hiç ilişkisi yok', 400);
      throw new RelationNotFountException(key);
    }

    const form = await this.httpService
      .get(relations[0]['_fields'][0].properties.url)
      .pipe(
        catchError(() => {
          throw new HttpException('connection refused due to connection lost or wrong data provided', 502);
        }),
      )
      .pipe(map((response) => response.data));
    return await firstValueFrom(form);

    //return form;
  }

  async create(key: string, createWinformRelationDto: CreateWinformRelationDto) {
    const node = await this.neo4jService.findOneNodeByKey(key);
    if (!node) {
      //throw new HttpException('uygun node id si giriniz', 400);
      throw new FacilityStructureNotFountException(key);
    }

    const winformObservableObject = await this.httpService
      .get(`${process.env.WINFORM_URL}/${createWinformRelationDto.referenceKey}`)
      .pipe(
        catchError(() => {
          throw new HttpException('connection refused due to connection lost or wrong data provided', 502);
        }),
      )
      .pipe(map((response) => response.data));
      
      const winform = await firstValueFrom(winformObservableObject);

      //ilgili formun başka bir structureda tanımlı olup olmadığını gösteren query
      // const virtualNodeCountInDbByReferenceKey = await this.neo4jService.checkSpecificVirtualNodeCountInDb(
      //   createWinformRelationDto.referenceKey,
      // RelationName.HAS_FORM,
      // );
      // if (virtualNodeCountInDbByReferenceKey.length > 0) {
      // throw new HttpException('already has relation with other nodes', 400);
      // }

    const relationExistanceBetweenVirtualNodeAndNodeByKey = await this.neo4jService.findNodeByKeysAndRelationName(
      key,
      createWinformRelationDto.referenceKey,
      RelationName.HAS_FORM,
    );
    if (relationExistanceBetweenVirtualNodeAndNodeByKey.length > 0) {
      throw new hasRelationException(key);
    }
    let virtualNode = new VirtualNode();

    virtualNode = assignDtoPropToEntity(virtualNode, createWinformRelationDto);
    const winformUrl = `${process.env.WINFORM_URL}/${createWinformRelationDto.referenceKey}`;

    virtualNode['url'] = winformUrl;
    const value = await this.neo4jService.createNode(virtualNode, [Neo4jLabelEnum.VIRTUAL, Neo4jLabelEnum.WINFORM]);

    console.log(value.properties.key);
    await this.neo4jService.addRelationWithRelationNameByKey(key, value.properties.key, RelationName.HAS_FORM);
    await this.neo4jService.addRelationWithRelationNameByKey(key, value.properties.key, RelationName.HAS_VIRTUAL_RELATION);

    // const structureUrl = `${process.env.STRUCTURE_URL}/${node.properties.key}`;
    // const kafkaObject = { referenceKey: key, parentKey: createWinformRelationDto.referenceKey, url: structureUrl };
    // await this.kafkaService.producerSendMessage('createStructureWinformRelation', JSON.stringify(kafkaObject));

    const response = { structure: node, asset: winform };

   return response;
  }

  async delete(key: string, referenceKey) {
    try {
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
        RelationName.HAS_FORM,
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
