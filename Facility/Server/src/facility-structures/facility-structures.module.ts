import { Module } from '@nestjs/common';
import { FacilityStructuresService } from './facility-structures.service';

import { MongooseModule } from '@nestjs/mongoose';
import { ConnectionEnums } from 'src/common/const/connection.enum';
import { Facility, FaciliySchema } from 'src/facility/entities/facility.entity';
import { FacilityStructure, FaciliyStructureSchema } from './entities/facility-structure.entity';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { FacilityStructureRepository } from './repositories/facility.structure..repository';
import { FacilityStructuresController } from './facility-structures.controller';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: FacilityStructure.name,
          schema: FaciliyStructureSchema,
        },
      ],
      ConnectionEnums.FACILITY,
    ),
  ],
  controllers: [FacilityStructuresController],
  providers: [
    FacilityStructuresService,
    {
      provide: RepositoryEnums.FACILITY_STRUCTURE,
      useClass: FacilityStructureRepository,
    },
  ],
})
export class FacilityStructuresModule {}
