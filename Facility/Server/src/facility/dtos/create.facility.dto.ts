import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Adress } from '../entities/facility.address';

import { ClassificationDetail } from '../entities/classification.detail';
import { i18nValidationMessage } from 'nestjs-i18n';
import { CreateFacilityStructureDto } from 'src/facility-structures/dto/create-facility-structure.dto';
export class CreateFacilityDto {
  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('greet.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('greet.IS_STRING') })
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
  @IsString()
  @Length(1, 50)
  realm: string;

  @ApiProperty()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ClassificationDetail)
  classifications: ClassificationDetail;

  @ApiProperty()
  @IsNotEmpty()
  label: string[];

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => Adress)
  address: Adress;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => CreateFacilityStructureDto)
  structure: CreateFacilityStructureDto;
}
