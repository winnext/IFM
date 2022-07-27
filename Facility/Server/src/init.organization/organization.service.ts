import { Inject, Injectable } from '@nestjs/common';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { CreateOrganizationDto } from './dtos/create.organization.dto';
import { UpdateOrganizationDto } from './dtos/update.organization.dto';
import { Facility } from './entities/facility.entity';
import { Span, OtelMethodCounter } from 'nestjs-otel';
import { BaseInterfaceRepository } from 'src/common/interface/base.facility.interface';

@Injectable()
export class OrganizationService {
  constructor(
    @Inject(RepositoryEnums.ORGANIZATION)
    private readonly organizationRepository: BaseInterfaceRepository<Facility>,
  ) {}

  @Span('find a facility by realm')
  @OtelMethodCounter()
  findOneByRealm(realm: string): Promise<Facility> {
    return this.organizationRepository.findOneByRealm(realm);
  }

  @Span('create a facility')
  @OtelMethodCounter()
  create(createFacilityDto: CreateOrganizationDto): Promise<Facility> {
    return this.organizationRepository.create(createFacilityDto);
  }

  @Span('update a facility')
  @OtelMethodCounter()
  update(id: string, updateFacilityDto: UpdateOrganizationDto) {
    return this.organizationRepository.update(id, updateFacilityDto);
  }

  findOne(label: string, realm: string) {
    return this.organizationRepository.findOneByRealmAndLabel(label, realm);
  }
}
