import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateAssetDto } from './create-asset.dto';
import * as moment from 'moment';

export class UpdateAssetDto extends OmitType(CreateAssetDto, ['key']) {
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;


  @IsOptional()
  updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
}
