import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsObject } from 'class-validator';
import { object } from 'joi';

export class CreateClassificationHistoryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsObject()
  @Type(() => Object)
  classification: object;
}
