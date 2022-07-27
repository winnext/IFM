import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BaseGraphObject } from 'src/common/baseobject/base.graph.object';

export class SetupNode extends BaseGraphObject {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  realm: string;

  canDelete = false;
}
