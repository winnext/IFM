import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateTestDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  structure_id: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  asset_id: string;
}
