import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreateClassificationDto } from './create-classification.dto';

export class UpdateClassificationDto extends PartialType(CreateClassificationDto) {

  @ApiProperty()
  @IsOptional()
  labeltags: string[];
}
