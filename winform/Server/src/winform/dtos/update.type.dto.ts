import { IsNotEmpty,  IsBoolean  } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTypeDto } from './create.type.dto';

export class UpdateTypeDto extends PartialType(CreateTypeDto) {

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;
    
  }