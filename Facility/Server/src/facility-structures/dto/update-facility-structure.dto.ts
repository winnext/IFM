import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateFacilityStructureDto } from './create-facility-structure.dto';
import * as moment from 'moment';

export class UpdateFacilityStructureDto extends OmitType(CreateFacilityStructureDto, ['key']) {
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
}
