import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsObject } from 'class-validator';

export class CreateFacilityStructureHistoryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsObject()
  @Type(() => Object)
  facilityStructure: object;

  @ApiProperty()
  @IsNotEmpty()
  @IsObject()
  @Type(() => Object)
  user: object;
}
