import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateFacilityDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 50)
  facility_name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 50)
  locations: string;
  
  @ApiProperty()
  @IsOptional()
  @IsAlphanumeric()
  @Length(1, 50)
  brand_name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 50)
  type_of_facility: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 50)
  classification_of_facility: string;

  @ApiProperty()
  @IsOptional()
  label: string[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 50)
  country: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 50)
  city: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 100)
  address: string;
}
