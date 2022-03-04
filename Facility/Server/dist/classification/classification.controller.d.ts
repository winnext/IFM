import { ClassificationService } from "./classification.service";
import { CreateClassificationDto } from "./dto/create-classification.dto";
import { UpdateClassificationDto } from "./dto/update-classification.dto";
export declare class ClassificationController {
    private readonly classificationService;
    constructor(classificationService: ClassificationService);
    create(createClassificationDto: CreateClassificationDto): Promise<import("./entities/classification.entity").Classification>;
    findAll(query: any): Promise<import("./entities/classification.entity").Classification[]>;
    findOne(id: string): Promise<import("./entities/classification.entity").Classification>;
    update(id: string, updateClassificationDto: UpdateClassificationDto): Promise<any>;
    remove(id: string): Promise<import("./entities/classification.entity").Classification>;
}
