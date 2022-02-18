import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FacilityModule } from './facility/facility.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    FacilityModule,ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost:27017',{
      connectionName:'facilities',
      dbName:'facility',
      user:'user',
      pass:'pass'
    }),
  ],
  
})
export class AppModule {}
