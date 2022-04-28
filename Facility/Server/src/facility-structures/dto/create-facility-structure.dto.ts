import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class CreateFacilityStructureDto {
 
@ApiProperty()
@IsOptional()
@IsString()
type?: string;

@ApiProperty()
@IsNotEmpty()
@IsString()
code: string;

@ApiProperty()
@IsNotEmpty()
@IsString()
name: string;

@ApiProperty()
@IsOptional()
@IsString()
description: string;

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
@IsString()
@Length(1, 50)
labelclass: string;

@ApiProperty()
@IsOptional()
@IsString()
typeId?: string;
}