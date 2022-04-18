import { Model } from 'mongoose';
import { Neo4jService } from 'nest-neo4j/dist';
import { PaginationParams } from 'src/common/commonDto/pagination.dto';
import { CreateClassificationDto } from '../dto/create-classification.dto';
import { UpdateClassificationDto } from '../dto/update-classification.dto';
import { Classification } from '../entities/classification.entity';
import { BaseGraphDatabaseInterfaceRepository } from 'src/common/repositories/graph.database.crud.interface';
export declare class ClassificationRepository implements BaseGraphDatabaseInterfaceRepository<Classification> {
    private readonly neo4jService;
    private readonly classificationModel;
    constructor(neo4jService: Neo4jService, classificationModel: Model<Classification>);
    findWithRelations(relations: any): Promise<Classification[]>;
    findOneById(id: string): Promise<{
        root: any;
    }>;
    getHello(): Promise<any>;
    findAll(data: PaginationParams): Promise<any[]>;
    create(createClassificationDto: CreateClassificationDto): Promise<Classification>;
    update(_id: string, updateClassificationto: UpdateClassificationDto): Promise<Classification>;
    delete(_id: string): Promise<Classification>;
    changeNodeBranch(_id: string, _target_parent_id: string): Promise<Classification>;
    deleteRelations(_id: string): Promise<void>;
    addRelations(_id: string, _target_parent_id: string): Promise<void>;
}
