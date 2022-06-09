import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreateAssetDto } from './create.asset.dto';

/**
 * Update Room Dto
 */
export class UpdateAssetDto extends PartialType(CreateAssetDto) {
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
