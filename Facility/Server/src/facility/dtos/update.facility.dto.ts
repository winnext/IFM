import { PartialType } from '@nestjs/swagger';

import { CreateFacilityDto } from './create.facility.dto';

export class UpdateFacilityDto extends PartialType(CreateFacilityDto) {}
