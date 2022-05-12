import { IsNotEmpty, IsString, Length, IsOptional, IsNumber  } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTypeDto {

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
    @IsOptional()
    @IsString()
    type?: string;


    @ApiProperty()
    @IsString()
    @Length(1, 200)
    @IsOptional()
    key: string;

    @ApiProperty()
    @IsOptional()
    tag: string[];

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    parent_id: number;  //not in entity 

    @ApiProperty()
    @IsNotEmpty()
    @IsString()Winform
    @Length(1, 50)
    labelclass: string;
    
  }