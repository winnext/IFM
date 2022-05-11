import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { IsNotEmptyWithI18nMessage, IsStringWithI18nMessage, LengthWithI18nMessage } from 'ifmcommon/dist';
import { i18nValidationMessageEnum } from 'ifmcommon';
import { Languages } from 'src/common/const/language.enum';

/**
 * Create User Dto
 */
export class CreateUserDto {
  /**
   * User Phone Number
   */
  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(7, 13)
  phone_number: string;

  /**
   * User Business Code
   */
  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 50)
  business_code: string;

  /**
   * User Business Name
   */
  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 50)
  business_name: string;

  /**
   * UserId from keycloack
   *
   * greet.NOT_EMPTY
   */
  @ApiProperty()
  @IsNotEmptyWithI18nMessage(i18nValidationMessageEnum.NOT_FOUND)
  @IsStringWithI18nMessage(i18nValidationMessageEnum.IS_STRING)
  @LengthWithI18nMessage(i18nValidationMessageEnum.LENGTH, 1, 50)
  userId: string;

  /**
   * User Language
   */
  @ApiProperty()
  @IsOptional()
  @IsEnum(Languages)
  language: Languages;
}
