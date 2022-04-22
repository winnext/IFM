import { IsDate, IsNotEmpty, IsString, Length,ArrayNotEmpty  } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateWinformDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Length(1, 50)
    form_name: string;
  
    @ApiProperty()
    @ArrayNotEmpty()
    items: any[];
  
    // @IsDate()
    // createdAt: Date;

    // @IsDate()
    // updatedAt: Date;
  
    
  }