import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Adress } from '../entities/facility.address';

import { ClassificationDetail } from '../entities/classification.detail';
import { i18nValidationMessage } from 'nestjs-i18n';
import { CreateFacilityStructureDto } from 'src/facility-structures/dto/create-facility-structure.dto';
import {
  LengthWithI18nMessage,
  i18nValidationMessageEnum,
  IsNotEmptyWithI18nMessage,
  IsStringWithI18nMessage,
} from 'ifmcommon';
export class CreateFacilityDto {
  @ApiProperty()
  @IsNotEmptyWithI18nMessage(i18nValidationMessageEnum.NOT_FOUND)
  @IsStringWithI18nMessage(i18nValidationMessageEnum.IS_STRING)
  @LengthWithI18nMessage(i18nValidationMessageEnum.LENGTH, 1, 50)
  facility_name: string;

  @ApiProperty()
  @IsOptional()
  @IsStringWithI18nMessage(i18nValidationMessageEnum.IS_STRING)
  @LengthWithI18nMessage(i18nValidationMessageEnum.LENGTH, 1, 50)
  locations: string;

  @ApiProperty()
  @IsNotEmptyWithI18nMessage(i18nValidationMessageEnum.NOT_FOUND)
  @IsStringWithI18nMessage(i18nValidationMessageEnum.IS_STRING)
  @LengthWithI18nMessage(i18nValidationMessageEnum.LENGTH, 1, 50)
  brand_name: string;

  @ApiProperty()
  @IsNotEmptyWithI18nMessage(i18nValidationMessageEnum.NOT_FOUND)
  @IsStringWithI18nMessage(i18nValidationMessageEnum.IS_STRING)
  @LengthWithI18nMessage(i18nValidationMessageEnum.LENGTH, 1, 50)
  type_of_facility: string;

  @ApiProperty()
  @IsNotEmptyWithI18nMessage(i18nValidationMessageEnum.NOT_FOUND)
  @IsStringWithI18nMessage(i18nValidationMessageEnum.IS_STRING)
  @LengthWithI18nMessage(i18nValidationMessageEnum.LENGTH, 1, 50)
  realm: string;

  @ApiProperty()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ClassificationDetail)
  classifications: ClassificationDetail;

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('greet.NOT_EMPTY') })
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
