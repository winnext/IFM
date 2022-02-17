import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateFacilityDto } from "./dtos/create.facility.dto";
import { UpdateFacilityDto } from "./dtos/update.facility.dto";
import { Facility } from "./entities/facility.entity";
import { FacilityRepository } from "./repositories/facility.repository";

@Injectable()
export class FacilityService {
  constructor(
    @Inject("FacilityRepositoryInterface")
    private readonly facilityRepository: FacilityRepository
  ) {}

  findAll(): Promise<Facility[]> {
    return this.facilityRepository.findAll();
  }

  async findOne(_id: string): Promise<Facility> {
    return this.facilityRepository.findOneById(_id)
  }

  create(createFacilityDto: CreateFacilityDto): Promise<Facility> {
    return this.facilityRepository.create(createFacilityDto);
  }

  async update(id: string, updateFacilityDto: UpdateFacilityDto) {
    return this.facilityRepository.update(id, updateFacilityDto);
  }

  async remove(id: string) {
    const facility = await this.findOne(id);
    return facility.remove();
  }
}
