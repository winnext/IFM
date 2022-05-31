import { PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { CreateFacilityDto } from './create.facility.dto';

export class UpdateFacilityDto extends PartialType(CreateFacilityDto) {
  @IsOptional()
  updatedAt = new Date();
}
