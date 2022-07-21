import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessageEnum, IsStringWithI18nMessage } from 'ifmcommon';

export class CreateWinformRelationDto {
  @ApiProperty()
  @IsStringWithI18nMessage(i18nValidationMessageEnum.IS_STRING)
  referenceKey: string;
}
