import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

/**
 * Update User Dto
 */
export class UpdateUserDto extends OmitType(CreateUserDto, ['userId']) {
  /**
   * updateDate when user updated
   */
  @IsOptional()
  updatedAt: Date = new Date();

  /**
   * updateDate when user updated
   */
  @IsOptional()
  loginAt: Date;

  @IsOptional()
  logoutAt: Date;

  /**
   * set user is active or not
   */
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  isActive: boolean;

  /**
   * set user is deleted or not
   */
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  isDeleted: boolean;
}
