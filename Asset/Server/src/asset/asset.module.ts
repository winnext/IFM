import { Module } from '@nestjs/common';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';
import { AssetRepository } from './repositories/asset.repository';

@Module({
  imports: [
  ],
  controllers: [AssetController],
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
