import { Module } from '@nestjs/common';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { StructureModule } from 'src/facility-structures/structure.module';
import { FacilityController } from './facility.controller';
import { FacilityService } from './facility.service';
import { FacilityRepository } from './repositories/facility.repository';

@Module({
  imports: [StructureModule],
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
