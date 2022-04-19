import { ClassificationHistoryService } from 'src/history/services/classification.history.service';
import { FacilityHistoryService } from 'src/history/services/facility.history.service';
import { FacilityStructureHistoryService } from 'src/history/services/facilitystructure.history.service';
import { RoomHistoryService } from 'src/history/services/room.history.service';
export declare class MessagebrokerController {
    private facilityHistoryService;
    private classificationHistoryService;
    private facilityStructureHistoryService;
    private roomHistoryService;
    constructor(facilityHistoryService: FacilityHistoryService, classificationHistoryService: ClassificationHistoryService, facilityStructureHistoryService: FacilityStructureHistoryService, roomHistoryService: RoomHistoryService);
    exceptionListener(message: any): any;
    loggerListener(message: any): any;
    operationListener(message: any): Promise<any>;
}
