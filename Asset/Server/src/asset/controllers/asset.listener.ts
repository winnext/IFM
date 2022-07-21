import { HttpService } from '@nestjs/axios';
import { Controller, HttpException, HttpStatus } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Unprotected } from 'nest-keycloak-connect';
import { catchError, firstValueFrom, map } from 'rxjs';
import { assignDtoPropToEntity, Neo4jService } from 'sgnm-neo4j/dist';
import { VirtualNode } from 'src/common/baseobject/virtual.node';
import { Neo4jLabelEnum } from 'src/common/const/neo4j.label.enum';
import { Facility } from '../entities/facility.entity';
import { AssetService } from '../services/asset.service';

@Controller('assetListener')
@Unprotected()
export class AssetListenerController {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly httpService: HttpService,
    private readonly assetService: AssetService,
  ) {}

  @EventPattern('createFacility')
  async createFacilityListener(@Payload() message) {
    const facilityInfo = message.value;
    const assetInfo = { name: 'Asset', realm: facilityInfo.realm };

    const facility = new Facility();
    const asset = new Facility();

    const finalFacilityObject = assignDtoPropToEntity(facility, facilityInfo);
    const finalAssetObject = assignDtoPropToEntity(asset, assetInfo);

    const facilityNode = await this.neo4jService.createNode(finalFacilityObject, [Neo4jLabelEnum.ROOT]);
    const assetNode = await this.neo4jService.createNode(finalAssetObject, [Neo4jLabelEnum.ASSET]);

    await this.neo4jService.addRelations(assetNode.identity.low, facilityNode.identity.low);
  }
  @EventPattern('createStructureAssetRelation')
  async createAssetListener(@Payload() message) {
    if (!message.value?.referenceKey || !message.value?.key) {
      throw new HttpException('key is not available on kafka object', 400);
    }
    const asset = await this.assetService.findOneNode(message.value?.key);
    //check if facilityStructure exist
    const structurePromise = await this.httpService
      .get(`${process.env.STRUCTURE_URL}/${message.value?.referenceKey}`)
      .pipe(
        catchError(() => {
          throw new HttpException('connection refused due to connection lost or wrong data provided', 502);
        }),
      )
      .pipe(map((response) => response.data));
    const structure = await firstValueFrom(structurePromise);

    if (!structure) {
      return 'structure not found';
    }
    const virtualFacilityStructureObject = message.value;

    const { parentKey } = virtualFacilityStructureObject;

    let virtualNode = new VirtualNode();

    virtualNode = assignDtoPropToEntity(virtualNode, virtualFacilityStructureObject);

    const value = await this.neo4jService.createNode(virtualNode, ['Virtual', 'Structure']);

    await this.neo4jService.addRelationWithRelationNameByKey(parentKey, value.properties.key, 'INSIDE_IN');

    await this.neo4jService.addRelationWithRelationNameByKey(parentKey, value.properties.key, 'HAS_VIRTUAL_RELATION');
  }

  @EventPattern('deleteStructure')
  async deleteAssetListener(@Payload() message) {
    if (!message.value?.referenceKey) {
      throw new HttpException('key is not provided by service', 400);
    }
    const asset = await this.assetService.findOneNode(message.value?.key);
    //check if asset exist
    const structurePromise = await this.httpService
      .get(`${process.env.STRUCTURE_URL}/${message.value?.referenceKey}`)
      .pipe(
        catchError(() => {
          throw new HttpException('connection refused due to connection lost or wrong data provided', 502);
        }),
      )
      .pipe(map((response) => response.data));

    const structure = await firstValueFrom(structurePromise);

    if (!structure) {
      return 'structure not found';
    }

    await this.neo4jService.write(`match (n:Virtual ) where n.referenceKey=$key set n.isDeleted=true return n`, {
      key: message.value.referenceKey,
    });
  }

  @EventPattern('deleteAssetFromStructure')
  async deleteAssetFromStructureListener(@Payload() message) {
    if (!message.value?.referenceKey || !message.value?.key) {
      throw new HttpException('key is not available on kafka object', 400);
    }

    const asset = await this.assetService.findOneNode(message.value?.key);

    //check if asset exist
    const structurePromise = await this.httpService
      .get(`${process.env.STRUCTURE_URL}/${message.value?.referenceKey}`)
      .pipe(
        catchError(() => {
          throw new HttpException('connection refused due to connection lost or wrong data provided', 502);
        }),
      )
      .pipe(map((response) => response.data));

    const relationExistanceBetweenVirtualNodeAndNodeByKey = await this.neo4jService.findNodeByKeysAndRelationName(
      message.value.key,
      message.value.referenceKey,
      'INSIDE_IN',
    );
    const virtualNodeId = relationExistanceBetweenVirtualNodeAndNodeByKey[0]['_fields'][1].identity.low;
    console.log(relationExistanceBetweenVirtualNodeAndNodeByKey[0]['_fields'][1].identity.low);

    await this.neo4jService.write(`match (n:Virtual ) where id(n)=${virtualNodeId} set n.isDeleted=true return n`);
  }
}
