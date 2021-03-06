import { IsNotEmpty, IsString, Length, IsOptional, IsNumber, IsBoolean  } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTypePropertyDto {


  @ApiProperty()
  @IsString()
  @Length(1, 200)
  @IsOptional()
  key?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  typeId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  label: string;
  
  @ApiProperty()
  @IsOptional()
  tag?: string[];

  @ApiProperty()
  @IsOptional()
  rules?: string[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 50)
  defaultValue?: string; 

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  labelclass: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()  
  parent_id: number; //not in entity

  @ApiProperty()
  @IsOptional()
  options?: string[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 50)
  placeholder?: string; 

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 50)
  label2?: string; 

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()  
  index: number;
  
  @ApiProperty()
  @IsOptional()
  optionalLabels: string[];
}
