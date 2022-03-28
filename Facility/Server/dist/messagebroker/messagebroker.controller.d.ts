import { ClassificationHistoryService } from 'src/history/classification.history.service';
import { FacilityHistoryService } from 'src/history/facility.history.service';
import { TraceService } from 'nestjs-otel';
export declare class MessagebrokerController {
    private facilityHistoryService;
    private classificationHistoryService;
    private readonly traceService;
    constructor(facilityHistoryService: FacilityHistoryService, classificationHistoryService: ClassificationHistoryService, traceService: TraceService);
    exceptionListener(message: any): any;
    loggerListener(message: any): any;
    operationListener(message: any): Promise<any>;
}
