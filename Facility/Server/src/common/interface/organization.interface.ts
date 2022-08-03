import { BaseInterfaceRepository } from "./base.facility.interface";

export interface OrganizationInterface<T> extends BaseInterfaceRepository<T> {
    importClassificationFromExcel(file: Express.Multer.File, language: string);
}