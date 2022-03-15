import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class Adress  {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    title: string;
    
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    country: string;
    
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    city: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    adress: string;
  };