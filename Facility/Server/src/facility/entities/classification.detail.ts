import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ClassificationDetail {
  @ApiProperty()
  @IsOptional()
  @IsString()
  classificationId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  rootKey: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  leafKey: string;
}
