import { Module } from '@nestjs/common';
import { StructureService } from './services/structure.service';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { FacilityStructureRepository } from './repositories/structure.repository';
import { StructureController } from './controllers/structure.controller';
import { AssetRelationRepository } from './repositories/asset.relation.repository';
import { AssetRelationController } from './controllers/asset.relation.controller';
import { AssetRelationService } from './services/asset.relation.service';
import { HttpModule } from '@nestjs/axios';
import { StructureListenerController } from './controllers/structure.listener';
import { WinformRelationController } from './controllers/winform.relation.controller';
import { WinformRelationService } from './services/winform.relation.service';
import { WinformRelationRepository } from './repositories/winform.relation.repository';
import { WinformDataOperationController } from './controllers/winform.data_operation.controller';
import { WinformDataOperationService } from './services/winform.data_operation.service';
import { WinformDataOperationRepository } from './repositories/winform.data_opreation.repository';

@Module({
  imports: [HttpModule],
  controllers: [StructureController, AssetRelationController, StructureListenerController, WinformRelationController, WinformDataOperationController],
  providers: [
    StructureService,
    AssetRelationService,
    WinformRelationService,
    WinformDataOperationService,
    {
      provide: RepositoryEnums.FACILITY_STRUCTURE,
      useClass: FacilityStructureRepository,
    },
    {
      provide: RepositoryEnums.ASSET_STRUCTURE_RELATION,
      useClass: AssetRelationRepository,
    },
    {
      provide: RepositoryEnums.WINFORM_STRUCTURE_RELATION,
      useClass: WinformRelationRepository,
    },
    {
      provide: RepositoryEnums.WINFORM_STRUCTURE_DATA_OPERATION,
      useClass: WinformDataOperationRepository,
    },
  ],
  exports: [StructureService],
})
export class StructureModule {}
