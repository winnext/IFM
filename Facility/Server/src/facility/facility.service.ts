import { Inject, Injectable } from "@nestjs/common";
import { createReadStream } from "fs";
import { PaginationParams } from "src/common/commonDto/pagination.dto";

import { RepositoryEnums } from "src/common/const/repository.enum";
import { checkObjectIddİsValid } from "src/common/func/objectId.check";
import { BaseInterfaceRepository } from "src/common/repositories/crud.repository.interface";
import { CreateFacilityDto } from "./dtos/create.facility.dto";
import { UpdateFacilityDto } from "./dtos/update.facility.dto";
import { Facility } from "./entities/facility.entity";

@Injectable()
export class FacilityService {
  constructor(
    @Inject(RepositoryEnums.FACILITY)
    private readonly facilityRepository: BaseInterfaceRepository<Facility>
  ) {}

  findAll(query: PaginationParams): Promise<Facility[]> {
    const { page, limit } = query;
    return this.facilityRepository.findAll(page, limit);
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
  /*
  createAll(rows: Facility[]): number {
    var j = 0;
    for (let i = 0; i < rows.length; i++) {
      if (i !== 0) {
        const dto = {
          facility_name: rows[i][0],
          locations: rows[i][1],
          brand_name: rows[i][2],
          type_of_facility: rows[i][3],
          classification_of_facility: rows[i][4],
          label: rows[i][5],
          country: rows[i][6],
          city: rows[i][7],
          address: rows[i][8],
        };
        this.facilityRepository.create(dto);
        j = j + 1;
      }
    }
    console.log("================================"+j)
    return j;
  }
  */
  async createAll(file:any): Promise<string> {
    var fs = require('fs');
    var csv = require('csv-parser');
    var multer = require('multer');
    try {
      fs 
        createReadStream(file.path).pipe(csv()).on('data',(data) => {

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
    
    return "success";
   }
   catch {
     return "failed";
   }
  }

}
