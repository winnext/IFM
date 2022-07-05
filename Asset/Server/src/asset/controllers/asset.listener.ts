import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Unprotected } from 'nest-keycloak-connect';
import { Neo4jService } from 'src/sgnm-neo4j/src';

@Controller('assetListener')
@Unprotected()
export class AssetListenerController {
  constructor(private readonly neo4jService: Neo4jService) {}

  @EventPattern('assetRelation')
  async testListener(@Payload() message) {
    console.log(typeof message);
    console.log(typeof message.value);
    const test = message.value;

    const { id, parentId } = test;
    console.log(typeof test);
    test['isDeleted'] = false;
    console.log(test);
    const value = await this.neo4jService.createNode(test, ['Virtual', 'Structure']);
    console.log(value);
    await this.neo4jService.addRelationWithRelationName(String(value['identity'].low), parentId, 'INSIDE_IN');

    await this.neo4jService.addRelationWithRelationName(
      String(value['identity'].low),
      parentId,
      'HAS_VİRTUAL_RELATION',
    );
    console.log(message.value);
  }
}
