import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateFacilityDto } from "./dtos/create.facility.dto";
import { UpdateFacilityDto } from "./dtos/update.facility.dto";
import { Facility } from "./entities/facility.entity";
import { FacilityService } from "./facility.service";
import { Roles, Unprotected } from "nest-keycloak-connect";
import { PaginationParams } from "src/common/commonDto/pagination.dto";
import { I18n, I18nContext, I18nService } from "nestjs-i18n";
import { diskStorage } from "multer";
import { FileInterceptor } from "@nestjs/platform-express";

@ApiTags("Facility")
@Controller("facility")
export class FacilityController {
  constructor(
    private readonly facilityService: FacilityService,
    private readonly i18n: I18nService
  ) {}

  @ApiOperation({
    summary: "Gets all facilities ",
    description:
      "If you want to get all facilities in your organization use this route. It takes no path or query params",
  })
  //@LoggerInter()
  @Get("/")
  @Roles({roles: ['facility_client_role_admin']})
  //@Unprotected()
  async getAllFacilities(
    @Query() query: PaginationParams,
    @I18n() i18n: I18nContext
  ): Promise<Facility[]> {
    return this.facilityService.findAll(query);
  }

  @ApiOperation({
    summary: "Gets facility with id ",
    description:
      "If you want to get specific facility in your organization use this route. It takes  query params which is  id",
  })
  @Get("/:_id")
  @Roles({roles: ['facility_client_role_user']})
  //@Unprotected()
  getFacility(@Param("_id") id: string): Promise<Facility> {
    return this.facilityService.findOne(id);
  }

  @ApiBody({
    type: CreateFacilityDto,
    description: "Store product structure",
  })
  @Post("")
  //@Unprotected()
  @Roles({roles: ['facility_client_role_admin']})
  createFacility(
    @Body() createFacilityDto: CreateFacilityDto
  ): Promise<Facility> {
    return this.facilityService.create(createFacilityDto);
  }

  @ApiBody({
    type: UpdateFacilityDto,
    description: "update  facility structure",
  })
  @Patch("/:_id")
  //@Unprotected()
  @Roles({roles: ['facility_client_role_admin']})
  updateFacility(
    @Param("_id") id: string,
    @Body() updateFacilityDto: UpdateFacilityDto
  ) {
    return this.facilityService.update(id, updateFacilityDto);
  }

  @Delete("/:_id")
  //@Unprotected()
  @Roles({roles: ['facility_client_role_admin']})
  deleteFacility(@Param("_id") id: string) {
    return this.facilityService.remove(id);
  }
  /*
  @ApiOperation({
    summary: "Load facility excel file ",
    description:
      "***",
  })
  //@Roles({roles: ['facility_client_role_user']})
  @Unprotected()
  @Post("createfacilities")
  async createFacilitiesByExcel(@Res() res) {
    const xlsxFile = require("read-excel-file/node");
    const facilityRows = await xlsxFile("./uploads/data.xlsx").then((rows) => {
      return rows;
    });
    const  createdFacilitiesCount = await this.facilityService.createAll(facilityRows);
    console.log("*********************************"+facilityRows);
    return res.send("createdFacilitiesCount = "+createdFacilitiesCount);
  }
  */

  @ApiOperation({
    summary: "Load facility cs file ",
    description:
      "***",
  })
  @Roles({roles: ['facility_client_role_admin']})
  //@Unprotected()
  @Post("createfacilities")
  @UseInterceptors(
    FileInterceptor('file', {
    storage: diskStorage({destination: './upload',}), 
  }),
  )
  async createFacilitiesByCsv(@Res() res, @UploadedFile() file: Express.Multer.File) {
    return res.send( await this.facilityService.createAll(file));
  }
}
