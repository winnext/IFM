import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConnectionEnums } from 'src/common/const/connection.enum';
import { ClassificationHistory, ClassificationHistorySchema } from './entities/classification.history.entity';
import { FacilityHistory, FaciliyHistorySchema } from './entities/facility.history.entity';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { ClassificationHistoryRepository } from './repositories/classification.history.repository';
import { FacilityHistoryRepository } from './repositories/facility.history.repository';
import { FacilityStructureHistoryRepository } from './repositories/facilitystructure.history.repository';
import { FacilityStructureHistory, FaciliyStructureHistorySchema } from './entities/facilitystructure.history.entity';
import { FacilityHistoryController } from './controllers/facility.history.controller';
import { ClassificationHistoryController } from './controllers/classification.history.controller';
import { FacilityStructureHistoryController } from './controllers/facility.structure.history.controller';
import { ClassificationHistoryService } from './services/classification.history.service';
import { FacilityHistoryService } from './services/facility.history.service';
import { FacilityStructureHistoryService } from './services/facilitystructure.history.service';
import { RoomHistory, RoomHistorySchema } from './entities/room.history.entity';
import { RoomHistoryService } from './services/room.history.service';
import { RoomHistoryRepository } from './repositories/room.history.repository';
import { RoomHistoryController } from './controllers/room.history.controller';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: FacilityHistory.name,
          schema: FaciliyHistorySchema,
        },

        {
          name: FacilityStructureHistory.name,
          schema: FaciliyStructureHistorySchema,
        },
      ],
      ConnectionEnums.FACILITY,
    ),
    MongooseModule.forFeature(
      [
        {
          name: ClassificationHistory.name,
          schema: ClassificationHistorySchema,
        },
      ],
      ConnectionEnums.CLASSIFICATION,
    ),
    MongooseModule.forFeature(
      [
        {
          name: RoomHistory.name,
          schema: RoomHistorySchema,
        },
      ],
      ConnectionEnums.ROOM,
    ),
  ],
  controllers: [
    FacilityHistoryController,
    ClassificationHistoryController,
    FacilityStructureHistoryController,
    RoomHistoryController,
  ],
  providers: [
    FacilityHistoryService,
    ClassificationHistoryService,
    FacilityStructureHistoryService,
    RoomHistoryService,
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
    {
      provide: RepositoryEnums.ROOM_HISTORY,
      useClass: RoomHistoryRepository,
    },
  ],
  exports: [FacilityHistoryService, ClassificationHistoryService, FacilityStructureHistoryService, RoomHistoryService],
})
export class HistoryModule {}
