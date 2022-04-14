import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsObject } from 'class-validator';

export class CreateUserHistoryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsObject()
  @Type(() => Object)
  user: object;

  @ApiProperty()
  @IsNotEmpty()
  @IsObject()
  @Type(() => Object)
  keycloack_user: object;
}
