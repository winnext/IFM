/* eslint-disable @typescript-eslint/no-var-requires */
import { Inject, Injectable } from '@nestjs/common';
import { createReadStream } from 'fs';
import { PaginationParams } from 'src/common/commonDto/pagination.dto';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { checkObjectIddİsValid } from 'src/common/func/objectId.check';
import { BaseInterfaceRepository } from 'src/common/repositories/crud.repository.interface';
import { CreateFacilityDto } from './dtos/create.facility.dto';
import { UpdateFacilityDto } from './dtos/update.facility.dto';
import { Facility } from './entities/facility.entity';

@Injectable()
export class FacilityService {
  constructor(
    @Inject(RepositoryEnums.FACILITY)
    private readonly facilityRepository: BaseInterfaceRepository<Facility>,
  ) {}

  findAll(query: PaginationParams): Promise<Facility[]> {
    return this.facilityRepository.findAll(query);
  }

  async findOne(id: string): Promise<Facility> {
    return this.facilityRepository.findOneById(id);
  }

  create(createFacilityDto: CreateFacilityDto): Promise<Facility> {
    return this.facilityRepository.create(createFacilityDto);
  }

  async update(id: string, updateFacilityDto: UpdateFacilityDto) {
    checkObjectIddİsValid(id);
    return this.facilityRepository.update(id, updateFacilityDto);
  }

  async remove(id: string) {
    const facility = await this.findOne(id);
    return facility.remove();
  }
  async createAll(file: any): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs');
    const csv = require('csv-parser');
    try {
      fs;
      createReadStream(file.path)
        .pipe(csv())
        .on('data', (data) => {
          const dto = {
            facility_name: data.facility_name,
            locations: data.locations,
            brand_name: data.brand_name,
            type_of_facility: data.type_of_facility,
            classification_of_facility: data.classification_of_facility,
            label: data.facility_name,
            country: data.label,
            city: data.city,
            address: data.address,
          };
          this.facilityRepository.create(dto);
        });

      return 'success';
    } catch {
      return 'failed';
    }
  }
}
