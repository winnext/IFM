import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { SetupNode } from '../entities/node.entity';

export class CreateFacilityDto {
  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => SetupNode)
  facilityInfo: SetupNode;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => SetupNode)
  structureInfo: SetupNode;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => SetupNode)
  classificationInfo: SetupNode;
}
