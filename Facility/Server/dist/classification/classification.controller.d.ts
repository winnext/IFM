import { PaginationParams } from 'src/common/commonDto/pagination.dto';
import { ClassificationService } from './classification.service';
import { CreateClassificationDto } from './dto/create-classification.dto';
import { UpdateClassificationDto } from './dto/update-classification.dto';
export declare class ClassificationController {
    private readonly classificationService;
    constructor(classificationService: ClassificationService);
    create(createClassificationDto: CreateClassificationDto): Promise<import("./entities/classification.entity").Classification>;
    findAll(paramDto: PaginationParams): Promise<import("./entities/classification.entity").Classification[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updateClassificationDto: UpdateClassificationDto): Promise<any>;
    remove(id: string): Promise<import("./entities/classification.entity").Classification>;
    changeNodeBranch(id: string, target_parent_id: string): Promise<import("./entities/classification.entity").Classification>;
    findOneNode(key: string): Promise<any>;
}
