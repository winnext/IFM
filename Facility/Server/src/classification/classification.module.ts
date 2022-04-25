import { Module } from '@nestjs/common';
import { ClassificationService } from './classification.service';
import { ClassificationController } from './classification.controller';
import { ClassificationRepository } from './repositories/classification.repository';
import { RepositoryEnums } from 'src/common/const/repository.enum';

@Module({
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
