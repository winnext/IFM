import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Unprotected } from 'nest-keycloak-connect';

import { FacilityHistoryService } from 'src/kiramenKatibin/services/facility.history.service';

@Controller('structureListener')
@Unprotected()
export class StructureListenerController {
  constructor(private facilityHistoryService: FacilityHistoryService) {}

  @EventPattern('structureRelation')
  testListener(@Payload() message): any {
    console.log(message.value);
  }
}
