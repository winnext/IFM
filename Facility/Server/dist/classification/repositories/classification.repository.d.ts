import { Model } from 'mongoose';
import { Neo4jService } from 'nest-neo4j/dist';
import { PaginationParams } from 'src/common/commonDto/pagination.dto';
import { BaseInterfaceRepository } from 'src/common/repositories/crud.repository.interface';
import { CreateClassificationDto } from '../dto/create-classification.dto';
import { UpdateClassificationDto } from '../dto/update-classification.dto';
import { Classification } from '../entities/classification.entity';
export declare class ClassificationRepository implements BaseInterfaceRepository<Classification> {
    private readonly neo4jService;
    private readonly classificationModel;
    constructor(neo4jService: Neo4jService, classificationModel: Model<Classification>);
    findWithRelations(relations: any): Promise<Classification[]>;
    findOneById(id: string): Promise<{
        root: any;
    }>;
    getHello(): Promise<any>;
    findAll(data: PaginationParams): Promise<any[]>;
    create(createClassificationDto: CreateClassificationDto): Promise<Classification & {
        _id: any;
    }>;
    update(_id: string, updateClassificationto: UpdateClassificationDto): Promise<Classification & {
        _id: any;
    }>;
    delete(_id: string): Promise<any>;
}
