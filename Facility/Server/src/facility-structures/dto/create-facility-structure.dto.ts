import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { i18nValidationMessageEnum, IsStringWithI18nMessage, LengthWithI18nMessage } from 'ifmcommon';
import { IsNotEmptyWithI18nMessage } from 'ifmcommon';

export class CreateFacilityStructureDto {
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
  @IsStringWithI18nMessage(i18nValidationMessageEnum.IS_STRING)
  formType?: string;
}
