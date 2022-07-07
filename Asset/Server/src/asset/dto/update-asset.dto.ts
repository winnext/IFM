import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateAssetDto } from './create-asset.dto';
import * as moment from 'moment';

export class UpdateAssetDto extends OmitType(CreateAssetDto, ['key']) {
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
}
