import { Inject, Injectable } from '@nestjs/common';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { CreateFacilityDto } from './dtos/create.facility.dto';
import { UpdateFacilityDto } from './dtos/update.facility.dto';
import { Facility } from './entities/facility.entity';
import { Span, OtelMethodCounter } from 'nestjs-otel';
import { BaseInterfaceRepository } from 'src/common/interface/base.facility.interface';

@Injectable()
export class FacilityService {
  constructor(
    @Inject(RepositoryEnums.FACILITY)
    private readonly facilityRepository: BaseInterfaceRepository<Facility>,
  ) {}

  @Span('find a facility by realm')
  @OtelMethodCounter()
  findOneByRealm(realm: string): Promise<Facility> {
    return this.facilityRepository.findOneByRealm(realm);
  }

  @Span('create a facility')
  @OtelMethodCounter()
  create(createFacilityDto: CreateFacilityDto): Promise<Facility> {
    return this.facilityRepository.create(createFacilityDto);
  }

  @Span('update a facility')
  @OtelMethodCounter()
  update(id: string, updateFacilityDto: UpdateFacilityDto) {
    return this.facilityRepository.update(id, updateFacilityDto);
  }
}
