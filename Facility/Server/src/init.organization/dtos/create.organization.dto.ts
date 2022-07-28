import { ApiProperty } from '@nestjs/swagger';
import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { SetupNode } from '../entities/setupnode.entity';

export class CreateOrganizationDto {
  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => SetupNode)
  organizationInfo: SetupNode;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => SetupNode)
  structureInfo: SetupNode;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => SetupNode)
  classificationInfo: SetupNode;

  @ApiProperty()
  @IsString()
  realm: string;
}
