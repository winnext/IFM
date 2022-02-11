import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Facility, FaciliySchema } from './entities/facility.entity';
import { FacilityController } from './facility.controller';
import { FacilityService } from './facility.service';

@Module({
  imports:[MongooseModule.forFeature([
    {
      name:Facility.name,
      schema:FaciliySchema,
    }
  ])],
  controllers: [FacilityController],
  providers: [FacilityService],
})
export class FacilityModule {}
