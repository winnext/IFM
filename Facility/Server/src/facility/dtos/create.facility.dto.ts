import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { TestNode } from '../entities/node.entity';

export class CreateFacilityDto {
  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => TestNode)
  facilityInfo: TestNode;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => TestNode)
  structureInfo: TestNode;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => TestNode)
  assetInfo: TestNode;

  @ApiProperty()
  @IsNotEmpty()
  realm: string;
}
