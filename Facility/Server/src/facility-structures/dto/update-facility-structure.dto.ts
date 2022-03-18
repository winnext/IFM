import { PartialType } from '@nestjs/swagger';
import { CreateFacilityStructureDto } from './create-facility-structure.dto';

export class UpdateFacilityStructureDto extends PartialType(CreateFacilityStructureDto) {}
