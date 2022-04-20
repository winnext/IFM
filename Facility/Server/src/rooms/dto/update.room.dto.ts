import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreateRoomDto } from './create.room.dto';

/**
 * Update Room Dto
 */
export class UpdateRoomDto extends PartialType(CreateRoomDto) {
  /**
   * updateDate when room updated
   */
  @IsOptional()
  updatedAt: Date = new Date();

  /**
   * set room is active or not
   */
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  isActive: boolean;

  /**
   * set room is deleted or not
   */
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  isDeleted: boolean;
}
