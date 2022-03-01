import { Inject, Injectable } from "@nestjs/common";
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
    const { skip, limit } = query;
    return this.facilityRepository.findAll(skip, limit);
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
}
