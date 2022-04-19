import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreateRoomDto } from './create.room.dto';

/**
 * Update User Dto
 */
export class UpdateRoomDto extends PartialType(CreateRoomDto) {
  /**
   * updateDate when user updated
   */
  @IsOptional()
  updatedAt: Date = new Date();

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
