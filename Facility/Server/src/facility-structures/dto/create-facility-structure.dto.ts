import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString, Length } from 'class-validator';

export class CreateFacilityStructureDto {
  @ApiProperty()
  @IsObject()
  @IsOptional()
  structure: object;
  @ApiProperty()
  @IsObject()
  @IsOptional()
  address: object;
  @ApiProperty()
  @IsString()
  @Length(1, 50)
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  facility_id: string;
}
