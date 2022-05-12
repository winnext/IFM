import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeRepository } from './repositories/type.repository';
import { TypeController } from './type.controller';
import { TypeService } from './type.service';

@Module({
 
  providers: [
    TypeService,
    {
      provide: 'Type',
      useClass: TypeRepository,
    },
  ],
  controllers: [TypeController],
})
export class TypeModule {}
