import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConnectionEnums } from 'src/common/const/connection.enum';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { FacilityStructuresModule } from 'src/facility-structures/facility-structures.module';
import { Facility, FaciliySchema } from './entities/facility.entity';
import { FacilityController } from './facility.controller';
import { FacilityService } from './facility.service';
import { FacilityRepository } from './repositories/facility.repository';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: Facility.name,
          schema: FaciliySchema,
        },
      ],

      ConnectionEnums.FACILITY,
    ),
    FacilityStructuresModule,
  ],
  controllers: [FacilityController],
  providers: [
    FacilityService,
    {
      provide: RepositoryEnums.FACILITY,
      useClass: FacilityRepository,
    },
  ],
})
export class FacilityModule {}
