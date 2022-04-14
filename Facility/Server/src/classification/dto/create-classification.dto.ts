import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class CreateClassificationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 200)
  name: string;

  @ApiProperty()
  @IsString()
  @Length(1, 200)
  @IsOptional()
  key: string;

  @ApiProperty()
  @IsOptional()
  tag: string[];
  
  @ApiProperty()
  @IsString()
  @IsOptional()
  parent_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  labelclass: string;
}
