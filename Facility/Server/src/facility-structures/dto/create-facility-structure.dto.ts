import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class CreateFacilityStructureDto {
 
@ApiProperty()
@IsNotEmpty()
@IsString()
type: string;

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
@IsNotEmpty()
@IsString()
facility_id: string;

@ApiProperty()
@IsNotEmpty()
@IsBoolean()
isActive: boolean;

@ApiProperty()
@IsNotEmpty()
@IsBoolean()
isDeleted: boolean;

@ApiProperty()
@IsOptional()
tag: string[];

@ApiProperty()
@IsNumber()
@IsOptional()
parent_id: number;

@ApiProperty()
@IsNotEmpty()
@IsString()
@Length(1, 50)
labelclass: string;
}