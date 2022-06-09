import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConnectionEnums } from 'src/common/const/connection.enum';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { Asset, AssetSchema } from './entities/room.entity';
import { RoomRepository } from './repositories/asset.repository';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: Asset.name,
          schema: AssetSchema,
        },
      ],
      ConnectionEnums.ASSET,
    ),
  ],
  controllers: [AssetController],
  providers: [
    AssetService,
    {
      provide: RepositoryEnums.ASSET,
      useClass: RoomRepository,
    },
  ],
})
export class AssetModule {}
