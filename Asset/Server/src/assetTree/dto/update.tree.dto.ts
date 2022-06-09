import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import * as moment from 'moment';
import { CreateTreeDto } from './create.tree.dto';

export class UpdateTreeDto extends PartialType(CreateTreeDto) {
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
}
