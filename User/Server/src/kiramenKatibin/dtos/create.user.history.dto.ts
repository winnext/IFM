import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsObject } from 'class-validator';

/**
 * Create User  History Dto
 */
export class CreateUserHistoryDto {
  /**
   * User object info
   */
  @ApiProperty()
  @IsNotEmpty()
  @IsObject()
  @Type(() => Object)
  user: object;

  /**
   * User from Incoming Request who (create,update,delete) this user
   */
  @ApiProperty()
  @IsNotEmpty()
  @IsObject()
  @Type(() => Object)
  keycloack_user: object;

  /**
   * request info from incoming request
   */
  @ApiProperty()
  @IsNotEmpty()
  @IsObject()
  @Type(() => Object)
  requestInformation: object;
}
