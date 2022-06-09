import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConnectionEnums } from 'src/common/const/connection.enum';

import { RepositoryEnums } from 'src/common/const/repository.enum';
import { TreeHistoryController } from './controllers/tree.history.controller';
import { AssetHistoryController } from './controllers/asset.history.controller';
import { TreeHistory, TreeHistorySchema } from './entities/tree.history.entity';
import { AssetHistory, AssetHistorySchema } from './entities/asset.history.entity';
import { TreeHistoryRepository } from './repositories/tree.history.repository';
import { AssetHistoryRepository } from './repositories/asset.history.repository';
import { TreeHistoryService } from './services/tree.history.service';
import { AssetHistoryService } from './services/asset.history.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: AssetHistory.name,
          schema: AssetHistorySchema,
        },

        {
          name: TreeHistory.name,
          schema: TreeHistorySchema,
        },
      ],
      ConnectionEnums.ASSET,
    ),
  ],
  controllers: [TreeHistoryController, AssetHistoryController],
  providers: [
    TreeHistoryService,
    AssetHistoryService,

    {
      provide: RepositoryEnums.ASSET_HISTORY,
      useClass: AssetHistoryRepository,
    },
    {
      provide: RepositoryEnums.ASSET_TREE_HISTORY,
      useClass: TreeHistoryRepository,
    },
  ],
  exports: [TreeHistoryService, AssetHistoryService],
})
export class HistoryModule {}
