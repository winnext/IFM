import { Controller, HttpException } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Neo4jService } from 'src/sgnm-neo4j/src';

@Controller('structureListener')
export class StructureListenerController {
  constructor(private readonly neo4jService: Neo4jService) {}

  @EventPattern('deleteAsset')
  async deleteAssetListener(@Payload() message) {
    if (message.value?.referenceKey || message.value?.parentKey) {
      throw new HttpException('key is not available', 400);
    }

    const deleteNode = await this.neo4jService.write(
      `match (n:Virtual ) where n.referenceKey=$key set n.isDeleted=true return n`,
      {
        key: message.value.key,
      },
    );
    console.log(deleteNode);
  }
}
