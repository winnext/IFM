import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FacilityModule } from './facility/facility.module';

@Module({
  imports: [
    FacilityModule,
    MongooseModule.forRoot('mongodb://localhost:27017/facility'),
  ],
})
export class AppModule {}
