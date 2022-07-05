import { Module } from '@nestjs/common';
import { StructureService } from './services/structure.service';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { FacilityStructureRepository } from './repositories/structure.repository';
import { StructureController } from './controllers/structure.controller';
import { StructureRelationsRepository } from './repositories/structure.relations.repository';
import { StructureRelationsController } from './controllers/structure.relations.controller';
import { StructureRelationsService } from './services/structure.relations.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [StructureController, StructureRelationsController],
  providers: [
    StructureService,
    StructureRelationsService,
    {
      provide: RepositoryEnums.FACILITY_STRUCTURE,
      useClass: FacilityStructureRepository,
    },
    {
      provide: RepositoryEnums.FACILITY_STRUCTURE_RELATİON,
      useClass: StructureRelationsRepository,
    },
  ],
  exports: [StructureService],
})
export class StructureModule {}
