import { OmitType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import moment from 'moment';
import { SetupNode } from '../entities/node.entity';

export class UpdateFacilityDto extends OmitType(SetupNode, ['cantDeleted']) {
  @IsOptional()
  updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
}
