import { Module } from '@nestjs/common';
import { ClassificationService } from './classification.service';
import { ClassificationController } from './classification.controller';
import {
  Classification,
  ClassificationSchema,
} from './entities/classification.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { ConnectionEnums } from 'src/common/const/connection.enum';
import { ClassificationRepository } from './repositories/classification.repository';
import { RepositoryEnums } from 'src/common/const/repository.enum';

@Module({
  imports: [
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
  controllers: [ClassificationController],
  providers: [
    ClassificationService,
    {
      provide: RepositoryEnums.CLASSIFICATION,
      useClass: ClassificationRepository,
    },
  ],
})
export class ClassificationModule {}
