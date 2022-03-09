import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

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
  @IsNotEmpty()
  @IsObject()
  classification_of_facility: object;

  @ApiProperty()
  @IsNotEmpty()
  label: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  country: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  city: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  address: string;
}
