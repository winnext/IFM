import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BaseGraphObject } from 'src/common/baseobject/base.graph.object';

export class TestNode extends BaseGraphObject {
  @ApiProperty()
  @IsOptional()
  @IsString()
  code: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  key: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  label: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  labelclass: string;

  cantDeleted = true;
}
