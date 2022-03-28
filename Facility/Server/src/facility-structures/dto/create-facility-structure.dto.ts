import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export class CreateFacilityStructureDto {
  @ApiProperty()
  @IsObject()
  @IsOptional()
  structure: object;
  @ApiProperty()
  @IsNotEmpty()
  facility_id: string;
}
