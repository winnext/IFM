import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsObject } from 'class-validator';

export class CreateClassificationHistoryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsObject()
  @Type(() => Object)
  classification: object;

  @ApiProperty()
  @IsNotEmpty()
  @IsObject()
  @Type(() => Object)
  user: object;

  @ApiProperty()
  @IsNotEmpty()
  @IsObject()
  @Type(() => Object)
  requestInformation: object;
}
