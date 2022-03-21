import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsObject, IsOptional, IsString, Length, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Adress } from '../entities/facility.address';

import { Classification } from 'src/classification/entities/classification.entity';
export class CreateFacilityDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  facility_name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 50)
  locations: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  brand_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  type_of_facility: string;

  @ApiProperty()
  @IsOptional()
  classifications: Classification[];

  @ApiProperty()
  @IsOptional()
  @IsObject()
  pathtoChosenNodeClassification: object[];

  @ApiProperty()
  @IsNotEmpty()
  label: string[];

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => Adress)
  address: Adress;

  @IsDate()
  updatedAt = new Date();
}
