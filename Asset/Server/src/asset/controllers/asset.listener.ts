import { Controller, HttpException, HttpStatus } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Unprotected } from 'nest-keycloak-connect';
import { VirtualNode } from 'src/common/baseobject/virtual.node';
import { assignDtoPropToEntity, Neo4jService } from 'src/sgnm-neo4j/src';
import {
  add_relation_with_relation_name__must_entered_error,
  add_relation_with_relation_name__create_relation_error,
} from 'src/sgnm-neo4j/src/constant/custom.error.object';
import { successResponse } from 'src/sgnm-neo4j/src/constant/success.response.object';

@Controller('assetListener')
@Unprotected()
export class AssetListenerController {
  constructor(private readonly neo4jService: Neo4jService) {}

  @EventPattern('createAssetRelation')
  async createAssetListener(@Payload() message) {
    if (message.value?.referenceKey || message.value?.parentKey) {
      throw new HttpException('key is not available on kafka object', 400);
    }
    const virtualFacilityStructure = message.value;

    const { parentKey } = virtualFacilityStructure;

    let virtualNode = new VirtualNode();

    virtualNode = assignDtoPropToEntity(virtualNode, test);

    const value = await this.neo4jService.createNode(virtualNode, ['Virtual', 'Structure']);

    await this.addRelationWithRelationNameByKey(value.properties.key, parentKey, 'INSIDE_IN');

    await this.addRelationWithRelationNameByKey(value.properties.key, parentKey, 'HAS_VİRTUAL_RELATION');
    console.log(message.value);
  }

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
}
