import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsObject } from 'class-validator';

export class CreateTreeHistoryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsObject()
  @Type(() => Object)
  tree: object;

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
