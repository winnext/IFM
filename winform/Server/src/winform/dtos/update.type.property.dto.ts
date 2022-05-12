import { IsNotEmpty,  IsBoolean  } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTypeDto } from './create.type.dto';
import { CreateTypePropertyDto } from './create.type.property.dto';

export class UpdateTypePropertyDto extends PartialType(CreateTypePropertyDto) {

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;
    
  }