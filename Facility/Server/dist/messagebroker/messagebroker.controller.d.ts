import { ClassificationHistoryService } from 'src/history/classification.history.service';
import { FacilityHistoryService } from 'src/history/facility.history.service';
import { Cache } from 'cache-manager';
export declare class MessagebrokerController {
    private facilityHistoryService;
    private classificationHistoryService;
    private cacheManager;
    constructor(facilityHistoryService: FacilityHistoryService, classificationHistoryService: ClassificationHistoryService, cacheManager: Cache);
    exceptionListener(message: any): any;
    loggerListener(message: any): any;
    operationListener(message: any): Promise<any>;
}
