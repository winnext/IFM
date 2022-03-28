import { ClassificationHistoryService } from 'src/history/classification.history.service';
import { FacilityHistoryService } from 'src/history/facility.history.service';
import { TraceService } from 'nestjs-otel';
import { FacilityStructureHistoryService } from 'src/history/facilitystructure.history.service';
export declare class MessagebrokerController {
    private facilityHistoryService;
    private classificationHistoryService;
    private facilityStructureHistoryService;
    private readonly traceService;
    constructor(facilityHistoryService: FacilityHistoryService, classificationHistoryService: ClassificationHistoryService, facilityStructureHistoryService: FacilityStructureHistoryService, traceService: TraceService);
    exceptionListener(message: any): any;
    loggerListener(message: any): any;
    operationListener(message: any): Promise<any>;
}
