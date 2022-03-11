/// <reference types="multer" />
import { CreateFacilityDto } from "./dtos/create.facility.dto";
import { UpdateFacilityDto } from "./dtos/update.facility.dto";
import { Facility } from "./entities/facility.entity";
import { FacilityService } from "./facility.service";
import { PaginationParams } from "src/common/commonDto/pagination.dto";
import { I18nContext, I18nService } from "nestjs-i18n";
export declare class FacilityController {
    private readonly facilityService;
    private readonly i18n;
    constructor(facilityService: FacilityService, i18n: I18nService);
    getAllFacilities(query: PaginationParams, i18n: I18nContext): Promise<Facility[]>;
    getFacility(id: string): Promise<Facility>;
    createFacility(createFacilityDto: CreateFacilityDto): Promise<Facility>;
    updateFacility(id: string, updateFacilityDto: UpdateFacilityDto): Promise<any>;
    deleteFacility(id: string): Promise<Facility>;
    createFacilitiesByCsv(res: any, file: Express.Multer.File): Promise<any>;
}
