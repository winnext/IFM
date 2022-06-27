import { Module } from '@nestjs/common';

import { RepositoryEnums } from 'src/common/const/repository.enum';
import { FacilityStructuresModule } from 'src/facility-structures/facility-structures.module';

import { FacilityController } from './facility.controller';
import { FacilityService } from './facility.service';
import { FacilityRepository } from './repositories/facility.repository';

@Module({
  imports: [FacilityStructuresModule],
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
