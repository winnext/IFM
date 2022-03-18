import { PaginationParams } from 'src/common/commonDto/pagination.dto';
import { ClassificationHistoryService } from './classification.historyservice';
import { ClassificationHistory } from './entities/classification.history.entity';
import { FacilityHistory } from './entities/facility.history.entity';
import { FacilityHistoryService } from './facility.historry.service';
export declare class MessagebrokerController {
    private readonly facilityHistoryService;
    private readonly classificationHistoryService;
    constructor(facilityHistoryService: FacilityHistoryService, classificationHistoryService: ClassificationHistoryService);
    exceptionListener(message: any): any;
    loggerListener(message: any): any;
    operationListener(message: any): Promise<any>;
    getAll(query: PaginationParams): Promise<FacilityHistory[]>;
    getAllClassification(query: PaginationParams): Promise<ClassificationHistory[]>;
}
