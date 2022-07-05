import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { i18nValidationMessageEnum, IsStringWithI18nMessage, LengthWithI18nMessage } from 'ifmcommon';
import { IsNotEmptyWithI18nMessage } from 'ifmcommon';

export class CreateAssetRelationDto {
  @ApiProperty()
  @IsStringWithI18nMessage(i18nValidationMessageEnum.IS_STRING)
  id: string;
}
