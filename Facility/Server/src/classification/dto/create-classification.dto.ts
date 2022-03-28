import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString, Length } from 'class-validator';

export class CreateClassificationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  name: string;

  @ApiProperty()
  @IsObject()
  detail: object;
}
