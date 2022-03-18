import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConnectionEnums } from 'src/common/const/connection.enum';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { FacilityHistory, FaciliyHistorySchema } from './entities/facility.history.entity';
import { MessagebrokerController } from './messagebroker.controller';
import { FacilityHistoryService } from './facility.historry.service';
import { FacilityHistoryRepository } from './repositories/facility.history.repository';
import { ClassificationHistory, ClassificationHistorySchema } from './entities/classification.history.entity';
import { ClassificationHistoryRepository } from './repositories/classification.history.repository';
import { ClassificationHistoryService } from './classification.historyservice';

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
  controllers: [MessagebrokerController],
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
})
export class MessagebrokerModule {}
