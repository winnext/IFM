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
      ],
      ConnectionEnums.FACILITY,
    ),
  ],
  controllers: [FacilityHistoryController, ClassificationHistoryController],
  providers: [
    FacilityHistoryService,
    ClassificationHistoryService,
    {
      provide: RepositoryEnums.FACILITY_HISTORY,
      useClass: FacilityHistoryRepository,
    },
    {
      provide: RepositoryEnums.CLASSIFICATION_HISTORY,
      useClass: ClassificationHistoryRepository,
    },
  ],
  exports: [FacilityHistoryService, ClassificationHistoryService],
})
export class HistoryModule {}
