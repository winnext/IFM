import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { CreateFacilityStructureDto } from './create-facility-structure.dto';

export class UpdateFacilityStructureDto extends PartialType(CreateFacilityStructureDto) {


@ApiProperty()
@IsNotEmpty()
@IsBoolean()
isActive: boolean;

@ApiProperty()
@IsNotEmpty()
@IsBoolean()
isDeleted: boolean;
}
