import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConnectionEnums } from 'src/common/const/connection.enum';

import { RepositoryEnums } from 'src/common/const/repository.enum';
import { UserHistory, UserHistorySchema } from './entities/user.history.entity';
import { UserHistoryRepository } from './repositories/user.history.repository';
import { UserHistoryController } from './user.history.controller';
import { UserHistoryService } from './user.history.service';

/**
 *  User  History Module
 */
@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: UserHistory.name,
          schema: UserHistorySchema,
        },
      ],
      ConnectionEnums.USER,
    ),
  ],
  controllers: [UserHistoryController],
  providers: [
    UserHistoryService,

    {
      provide: RepositoryEnums.USER_HISTORY,
      useClass: UserHistoryRepository,
    },
  ],
  exports: [UserHistoryService],
})
export class HistoryModule {}
