import {
  IsAlphanumeric,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Max,
} from 'class-validator';

export class UpdateFacilityDto {
  @IsOptional()
  @IsString()
  @Length(1, 50)
  facility_name: string;

  @IsOptional()
  @IsAlphanumeric()
  @Length(1, 50)
  brand_name: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  type_of_facility: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  classification_of_facility: string;

  @IsOptional()
  label: string[];

  @IsOptional()
  @IsString()
  @Length(1, 50)
  country: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  city: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  address: string;
}
