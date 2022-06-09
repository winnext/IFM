import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

/**
 * Create Room Dto
 */
export class CreateAssetDto {
  /**
   * Room Code
   */
  @ApiProperty()
  @IsOptional()
  code: string;
}
