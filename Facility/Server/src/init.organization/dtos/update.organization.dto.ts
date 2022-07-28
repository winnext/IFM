import { OmitType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import * as moment from 'moment';
import { SetupNode } from '../entities/setupnode.entity';

export class UpdateOrganizationDto extends OmitType(SetupNode, ['canDelete', 'realm']) {
  updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
}
