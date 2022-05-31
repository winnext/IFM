/* eslint-disable @typescript-eslint/no-var-requires */
import { Inject, Injectable } from '@nestjs/common';
import { createReadStream } from 'fs';
import { PaginationParams } from 'src/common/commonDto/pagination.dto';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { checkObjectIddİsValid } from 'ifmcommon';
import { BaseInterfaceRepository } from 'ifmcommon';
import { CreateFacilityDto } from './dtos/create.facility.dto';
import { UpdateFacilityDto } from './dtos/update.facility.dto';
import { Facility } from './entities/facility.entity';
import { Span, OtelMethodCounter } from 'nestjs-otel';
import { FacilityHistory } from 'src/kiramenKatibin/entities/facility.history.entity';

@Injectable()
export class FacilityService {
  constructor(
    @Inject(RepositoryEnums.FACILITY)
    private readonly facilityRepository: BaseInterfaceRepository<Facility>,
  ) {}

  @Span('find all Facilities')
  @OtelMethodCounter()
  findAll(query: PaginationParams): Promise<Facility[]> {
    return this.facilityRepository.findAll(query);
  }

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

  @Span('remove a facility')
  @OtelMethodCounter()
  async remove(id: string) {
    return this.facilityRepository.delete(id);
  }

  @Span('create many facilities with file')
  @OtelMethodCounter()
  async createAll(file: any): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs');
    const csv = require('csv-parser');
    try {
      fs;
      createReadStream(file.path)
        .pipe(csv())
        .on('data', (data) => {
          const adrarray = [];
          let addressarray = [];
          addressarray = data.adress.split(';');

          let j = 1;
          let o = {};
          let a = [];
          for (let i = 0; i < addressarray.length; i++) {
            if (j < 5) {
              a.push(addressarray[i]);
              j = j + 1;
            } else {
              o = { title: a[0], country: a[1], city: a[2], adress: a[3] };
              adrarray.push(o);
              o = {};
              a = [];
              a.push(addressarray[i]);
              j = 2;
            }
          }
          if (a.length == 4) {
            o = { title: a[0], country: a[1], city: a[2], adress: a[3] };
            adrarray.push(o);
          } else if (a.length == 3) {
            o = { title: a[0], country: a[1], city: a[2] };
            adrarray.push(o);
          } else if (a.length == 2) {
            o = { title: a[0], country: a[1] };
            adrarray.push(o);
          } else if (a.length == 1) {
            o = { title: a[0] };
            adrarray.push(o);
          }

          const dto = {
            facility_name: data.facility_name,
            locations: data.locations,
            brand_name: data.brand_name,
            type_of_facility: data.type_of_facility,
            //classifications: data.classifications.split(";"), //if an classificationid array comes
            classifications: {},
            label: data.label.split(';'),
            updatedAt: new Date(),
            address: adrarray,
          };
          this.facilityRepository.create(dto);
        });

      return 'success';
    } catch {
      return 'failed';
    }
  }
}
