import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { i18nValidationMessageEnum, IsStringWithI18nMessage, LengthWithI18nMessage } from 'ifmcommon';
import { IsNotEmptyWithI18nMessage } from 'ifmcommon';

export class CreateContactDto {
  @ApiProperty()
  @IsOptional()
  @IsStringWithI18nMessage(i18nValidationMessageEnum.IS_STRING)
  description: string;

  @ApiProperty()
  @IsStringWithI18nMessage(i18nValidationMessageEnum.IS_STRING)
  @LengthWithI18nMessage(i18nValidationMessageEnum.LENGTH, 1, 50)
  @IsOptional()
  key?: string;

  @ApiProperty()
  @IsNotEmptyWithI18nMessage(i18nValidationMessageEnum.NOT_FOUND)
  @IsStringWithI18nMessage(i18nValidationMessageEnum.IS_STRING)
  name: string;

  @ApiProperty()
  @IsOptional()
  tag?: string[];

  @ApiProperty()
  @IsOptional()
  formTypeId?: string;

  @ApiProperty()
  @IsOptional()
  labels?: string[];

  @ApiProperty()
  @IsOptional()
  parentId?: string;


  @ApiProperty()
  @IsNotEmptyWithI18nMessage(i18nValidationMessageEnum.NOT_FOUND)
  @IsStringWithI18nMessage(i18nValidationMessageEnum.IS_STRING)
  email: string;

  @ApiProperty()
  @IsNotEmptyWithI18nMessage(i18nValidationMessageEnum.NOT_FOUND)
  @IsStringWithI18nMessage(i18nValidationMessageEnum.IS_STRING)
  company: string;

  @ApiProperty()
  @IsNotEmptyWithI18nMessage(i18nValidationMessageEnum.NOT_FOUND)
  @IsStringWithI18nMessage(i18nValidationMessageEnum.IS_STRING)
  phone: string;

  @IsOptional()
  department?: string;

  @ApiProperty()
  @IsOptional()
  organizationCode?: string;

  @ApiProperty()
  @IsOptional()
  familyName?: string;

  @ApiProperty()
  @IsOptional()
  street?: string;

  @ApiProperty()
  @IsOptional()
  postalBox?: string;

  @ApiProperty()
  @IsOptional()
  town?: string;

  @ApiProperty()
  @IsOptional()
  stateRegion?: string;

  @ApiProperty()
  @IsOptional()
  postalCode?: string;

  @ApiProperty()
  @IsOptional()
  country?: string;
}
