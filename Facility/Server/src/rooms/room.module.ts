import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConnectionEnums } from 'src/common/const/connection.enum';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { Room, RoomSchema } from './entities/room.entity';
import { RoomRepository } from './repositories/room.repository';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: Room.name,
          schema: RoomSchema,
        },
      ],
      ConnectionEnums.ROOM,
    ),
  ],
  controllers: [RoomController],
  providers: [
    RoomService,
    {
      provide: RepositoryEnums.ROOM,
      useClass: RoomRepository,
    },
  ],
})
export class RoomModule {}
