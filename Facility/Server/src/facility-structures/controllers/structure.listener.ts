import { HttpService } from '@nestjs/axios';
import { Controller, HttpException } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { catchError, firstValueFrom, map } from 'rxjs';
import { AssetNotFoundException } from 'src/common/notFoundExceptions/not.found.exception';
import { Neo4jService } from 'src/sgnm-neo4j/src';

@Controller('structureListener')
export class StructureListenerController {
  constructor(private readonly neo4jService: Neo4jService,private readonly httpService: HttpService) {}

  @EventPattern('deleteAsset')
  async deleteAssetListener(@Payload() message) {
  
    if (!message.value?.referenceKey ) {
      throw new HttpException('key is not provided by service', 400);
    }

     //check if asset exist
    const assetPromise = await this.httpService
    .get(`${process.env.ASSET_URL}/${message.value?.referenceKey}`)
    .pipe(
      catchError(() => {
        throw new HttpException('connection refused due to connection lost or wrong data provided', 502);
      }),
    )
    .pipe(map((response) => response.data));

    const asset = await firstValueFrom(assetPromise);

    if (!asset) {
      throw new AssetNotFoundException(message.value?.referenceKey);
    }

     await this.neo4jService.write(
      `match (n:Virtual ) where n.referenceKey=$key set n.isDeleted=true return n`,
      {
        key: message.value.referenceKey,
      },
    );
    
  }
}
