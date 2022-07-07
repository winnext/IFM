import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessageEnum, IsStringWithI18nMessage } from 'ifmcommon';

export class CreateAssetRelationDto {
  @ApiProperty()
  @IsStringWithI18nMessage(i18nValidationMessageEnum.IS_STRING)
  referenceKey: string;
}
