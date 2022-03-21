import { ClassificationHistoryService } from 'src/history/classification.historyservice';
import { FacilityHistoryService } from 'src/history/facility.historry.service';
export declare class MessagebrokerController {
    private facilityHistoryService;
    private classificationHistoryService;
    constructor(facilityHistoryService: FacilityHistoryService, classificationHistoryService: ClassificationHistoryService);
    exceptionListener(message: any): any;
    loggerListener(message: any): any;
    operationListener(message: any): Promise<any>;
}
