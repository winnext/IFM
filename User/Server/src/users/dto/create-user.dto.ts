import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
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
  @IsNotEmpty()
  @IsString()
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
