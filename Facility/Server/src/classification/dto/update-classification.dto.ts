import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateClassificationDto } from './create-classification.dto';
import * as moment from 'moment';

export class UpdateClassificationDto extends  OmitType(CreateClassificationDto,["key"]) {
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
}
