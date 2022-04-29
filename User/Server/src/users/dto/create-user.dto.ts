import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
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
   */
  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('greet.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('greet.IS_STRING') })
  @Length(1, 50)
  userId: string;

  /**
   * User Language
   */
  @ApiProperty()
  @IsOptional()
  @IsEnum(Languages)
  language: Languages;
}
