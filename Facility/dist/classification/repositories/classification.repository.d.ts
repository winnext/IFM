import { Model } from "mongoose";
import { BaseInterfaceRepository } from "src/common/repositories/crud.repository.interface";
import { CreateClassificationDto } from "../dto/create-classification.dto";
import { UpdateClassificationDto } from "../dto/update-classification.dto";
import { Classification } from "../entities/classification.entity";
export declare class ClassificationRepository implements BaseInterfaceRepository<Classification> {
    private readonly classificationModel;
    constructor(classificationModel: Model<Classification>);
    findWithRelations(relations: any): Promise<Classification[]>;
    findOneById(id: string): Promise<Classification>;
    findAll(): Promise<(Classification & {
        _id: any;
    })[]>;
    create(createClassificationDto: CreateClassificationDto): Promise<Classification & {
        _id: any;
    }>;
    update(_id: string, updateClassificationto: UpdateClassificationDto): Promise<Classification & {
        _id: any;
    }>;
    delete(_id: string): Promise<any>;
}
