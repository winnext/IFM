import { ClassificationHistoryService } from 'src/history/classification.history.service';
import { FacilityHistoryService } from 'src/history/facility.history.service';
import { FacilityStructureHistoryService } from 'src/history/facilitystructure.history.service';
export declare class MessagebrokerController {
    private facilityHistoryService;
    private classificationHistoryService;
    private facilityStructureHistoryService;
    constructor(facilityHistoryService: FacilityHistoryService, classificationHistoryService: ClassificationHistoryService, facilityStructureHistoryService: FacilityStructureHistoryService);
    exceptionListener(message: any): any;
    loggerListener(message: any): any;
    operationListener(message: any): Promise<any>;
}
