import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConnectionEnums } from 'src/common/const/connection.enum';
import { ClassificationHistory, ClassificationHistorySchema } from './entities/classification.history.entity';
import { FacilityHistory, FaciliyHistorySchema } from './entities/facility.history.entity';
import { ClassificationHistoryController } from './classification.history.controller';
import { FacilityHistoryController } from './facility.history.controller';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { ClassificationHistoryService } from './classification.history.service';
import { FacilityHistoryService } from './facility.history.service';
import { ClassificationHistoryRepository } from './repositories/classification.history.repository';
import { FacilityHistoryRepository } from './repositories/facility.history.repository';
import { FacilityStructureHistoryService } from './facilitystructure.history.service';
import { FacilityStructureHistoryRepository } from './repositories/facilitystructure.history.repository';
import { FacilityStructureHistory, FaciliyStructureHistorySchema } from './entities/facilitystructure.history.entity';
import { FacilityStructureHistoryController } from './facility.structure.history.controller';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: FacilityHistory.name,
          schema: FaciliyHistorySchema,
        },
        {
          name: ClassificationHistory.name,
          schema: ClassificationHistorySchema,
        },
        {
          name: FacilityStructureHistory.name,
          schema: FaciliyStructureHistorySchema,
        },
      ],
      ConnectionEnums.FACILITY,
    ),
  ],
  controllers: [FacilityHistoryController, ClassificationHistoryController, FacilityStructureHistoryController],
  providers: [
    FacilityHistoryService,
    ClassificationHistoryService,
    FacilityStructureHistoryService,
    {
      provide: RepositoryEnums.FACILITY_HISTORY,
      useClass: FacilityHistoryRepository,
    },
    {
      provide: RepositoryEnums.CLASSIFICATION_HISTORY,
      useClass: ClassificationHistoryRepository,
    },
    {
      provide: RepositoryEnums.FACILITY_STRUCTURE_HISTORY,
      useClass: FacilityStructureHistoryRepository,
    },
  ],
  exports: [FacilityHistoryService, ClassificationHistoryService, FacilityStructureHistoryService],
})
export class HistoryModule {}
