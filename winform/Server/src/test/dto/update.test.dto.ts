import { IsNotEmpty, IsString, Length, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTestDto {
  @IsNumber()
  __v?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  name: string;

  @ApiProperty()
  @IsOptional()
  items: any[];
}
