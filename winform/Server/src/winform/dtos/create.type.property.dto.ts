import { IsNotEmpty, IsString, Length, IsOptional, IsNumber  } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTypePropertyDto {


  @ApiProperty()
  @IsString()
  @Length(1, 200)
  @IsOptional()
  key: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  type?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  typeId?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  name: string;
  
  @ApiProperty()
  @IsOptional()
  tag: string[];

  @ApiProperty()
  @IsOptional()
  rules: string[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 50)
  defaultValue: string; 

  }