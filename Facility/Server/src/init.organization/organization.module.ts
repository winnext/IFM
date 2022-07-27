import { Module } from '@nestjs/common';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { StructureModule } from 'src/facility-structures/structure.module';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { OrganizationRepository } from './repositories/organization.repository';

@Module({
  imports: [StructureModule],
  controllers: [OrganizationController],
  providers: [
    OrganizationService,
    {
      provide: RepositoryEnums.ORGANIZATION,
      useClass: OrganizationRepository,
    },
  ],
})
export class OrganizationModule {}
