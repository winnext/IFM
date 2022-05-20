import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateClassificationDto } from './create-classification.dto';
import * as moment from 'moment';

export class UpdateClassificationDto extends PartialType(CreateClassificationDto) {
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
}
