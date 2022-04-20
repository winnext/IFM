import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConnectionEnums } from 'src/common/const/connection.enum';

import { RepositoryEnums } from 'src/common/const/repository.enum';
import { RoomHistory, RoomHistorySchema } from './entities/user.history.entity';
import { RoomHistoryRepository } from './repositories/user.history.repository';

import { RoomHistoryController } from './room.history.controller';
import { RoomHistoryService } from './room.history.service';

/**
 *  User  History Module
 */
@Module({
  imports: [
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
  controllers: [RoomHistoryController],
  providers: [
    RoomHistoryService,

    {
      provide: RepositoryEnums.ROOM_HISTORY,
      useClass: RoomHistoryRepository,
    },
  ],
  exports: [RoomHistoryService],
})
export class HistoryModule {}
