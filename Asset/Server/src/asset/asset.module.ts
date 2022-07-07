import { Module } from '@nestjs/common';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { AssetController } from './controllers/asset.controller';
import { AssetListenerController } from './controllers/asset.listener';

import { AssetRepository } from './repositories/asset.repository';
import { AssetService } from './services/asset.service';

@Module({
  imports: [],
  controllers: [AssetController, AssetListenerController],
  providers: [
    AssetService,
    {
      provide: RepositoryEnums.FACILITY_STRUCTURE,
      useClass: AssetRepository,
    },
  ],
  exports: [AssetService],
})
export class AssetModule {}
