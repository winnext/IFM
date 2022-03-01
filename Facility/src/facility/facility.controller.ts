import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { LoggerInter } from "src/common/interceptors/logger.interceptor";
import { CreateFacilityDto } from "./dtos/create.facility.dto";
import { UpdateFacilityDto } from "./dtos/update.facility.dto";
import { Facility } from "./entities/facility.entity";

import { FacilityService } from "./facility.service";
import { Roles, Unprotected } from "nest-keycloak-connect";
import { PaginationParams } from "src/common/commonDto/pagination.dto";
import { query } from "express";

@ApiTags("facility")
@Controller("facility")
export class FacilityController {
  constructor(private readonly facilityService: FacilityService) {}

  @ApiOperation({
    summary: "Gets all facilities ",
    description:
      "If you want to get all facilities in your organization use this route. It takes no path or query params",
  })
  //@LoggerInter()
  @Get("/")
  //@Roles({roles: ['facility_client_role_admin']})
  @Unprotected()
  getAllFacilities(@Query() query:PaginationParams): Promise<Facility[]> {
    
    return this.facilityService.findAll(query);
  }

  @ApiOperation({
    summary: "Gets facility with id ",
    description:
      "If you want to get specific facility in your organization use this route. It takes  query params which is  id",
  })
  @Get("/:id")
  //@Roles({roles: ['facility_client_role_user']})
  @Unprotected()
  getFacility(@Param("id") id: string): Promise<Facility> {
    return this.facilityService.findOne(id);
  }

  @ApiBody({
    type: CreateFacilityDto,
    description: "Store product structure",
  })
  @Post("")
  @Unprotected()
  //@Roles({roles: ['facility_client_role_admin']})
  createFacility(
    @Body() createFacilityDto: CreateFacilityDto
  ): Promise<Facility> {
    return this.facilityService.create(createFacilityDto);
  }

  @ApiBody({
    type: UpdateFacilityDto,
    description: "update  facility structure",
  })
  @Patch("/:id")
  updateFacility(
    @Param("id") id: string,
    @Body() updateFacilityDto: UpdateFacilityDto
  ) {
    return this.facilityService.update(id, updateFacilityDto);
  }

  @Delete("/:id")
  deleteFacility(@Param("id") id: string) {
    return this.facilityService.remove(id);
  }
}
