import { Module } from '@nestjs/common';
import { FacilityStructuresService } from './facility-structures.service';
import { FacilityStructuresController } from './facility-structures.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConnectionEnums } from 'src/common/const/connection.enum';
import { Facility, FaciliySchema } from 'src/facility/entities/facility.entity';
import { FacilityStructure, FaciliyStructureSchema } from './entities/facility-structure.entity';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { FacilityStructureRepository } from './repositories/facility.structure..repository';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: FacilityStructure.name,
          schema: FaciliyStructureSchema,
        },
        {
          name: Facility.name,
          schema: FaciliySchema,
        },
      ],
      ConnectionEnums.FACILITY,
    ),
  ],
  controllers: [FacilityStructuresController],
  providers: [
    FacilityStructuresService,
    {
      provide: RepositoryEnums.FACILITYSTRUCTURE,
      useClass: FacilityStructureRepository,
    },
  ],
})
export class FacilityStructuresModule {}
