import { BaseInterfaceRepository } from 'src/common/repositories/crud.repository.interface';
import { CreateClassificationDto } from './dto/create-classification.dto';
import { UpdateClassificationDto } from './dto/update-classification.dto';
import { Classification } from './entities/classification.entity';
export declare class ClassificationService {
    private readonly classificationRepository;
    constructor(classificationRepository: BaseInterfaceRepository<Classification>);
    create(createClassificationDto: CreateClassificationDto): Promise<Classification>;
    findAll(query: any): Promise<Classification[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updateClassificationDto: UpdateClassificationDto): Promise<any>;
    remove(id: string): Promise<Classification>;
}
