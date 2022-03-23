import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ClassificationDetail {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  classificationId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  rootKey: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  leafKey: string;
}
