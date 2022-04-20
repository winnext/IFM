import { CreateClassificationDto } from './dto/create-classification.dto';
import { UpdateClassificationDto } from './dto/update-classification.dto';
import { Classification } from './entities/classification.entity';
import { BaseGraphDatabaseInterfaceRepository } from 'src/common/repositories/graph.database.crud.interface';
export declare class ClassificationService {
    private readonly classificationRepository;
    constructor(classificationRepository: BaseGraphDatabaseInterfaceRepository<Classification>);
    create(createClassificationDto: CreateClassificationDto): Promise<Classification>;
    findAll(query: any): Promise<Classification[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updateClassificationDto: UpdateClassificationDto): Promise<any>;
    remove(id: string): Promise<Classification>;
    changeNodeBranch(id: string, target_parent_id: string): Promise<Classification>;
    findOneNode(key: string): Promise<any>;
}
