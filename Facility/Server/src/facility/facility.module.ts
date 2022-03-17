import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Classification, ClassificationSchema } from 'src/classification/entities/classification.entity';
import { ConnectionEnums } from 'src/common/const/connection.enum';
import { RepositoryEnums } from 'src/common/const/repository.enum';
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
    MongooseModule.forFeature(
      [
        {
          name: Classification.name,
          schema: ClassificationSchema,
        },
      ],
      ConnectionEnums.CLASSIFICATION,
    ),
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
