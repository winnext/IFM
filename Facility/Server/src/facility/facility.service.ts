import { Inject, Injectable } from '@nestjs/common';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { BaseInterfaceRepository } from 'ifmcommon';
import { CreateFacilityDto } from './dtos/create.facility.dto';
import { UpdateFacilityDto } from './dtos/update.facility.dto';
import { Facility } from './entities/facility.entity';
import { Span, OtelMethodCounter } from 'nestjs-otel';

@Injectable()
export class FacilityService {
  constructor(
    @Inject(RepositoryEnums.FACILITY)
    private readonly facilityRepository: BaseInterfaceRepository<Facility>,
  ) {}

  @Span('find a facility by id')
  @OtelMethodCounter()
  async findOne(realm: string): Promise<Facility> {
    return this.facilityRepository.findOneById(realm);
  }

  @Span('create a facility')
  @OtelMethodCounter()
  async create(createFacilityDto: CreateFacilityDto): Promise<Facility> {
    return this.facilityRepository.create(createFacilityDto);
  }

  @Span('update a facility')
  @OtelMethodCounter()
  async update(id: string, updateFacilityDto: UpdateFacilityDto) {
    return this.facilityRepository.update(id, updateFacilityDto);
  }
}
