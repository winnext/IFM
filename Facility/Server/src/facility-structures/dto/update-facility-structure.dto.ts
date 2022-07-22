import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { CreateFacilityStructureDto } from './create-facility-structure.dto';
import * as moment from 'moment';

export class UpdateFacilityStructureDto extends OmitType(CreateFacilityStructureDto, ['key']) {
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

  @ApiProperty()
  @IsOptional()
  parentId: string;
}
