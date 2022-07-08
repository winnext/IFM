import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { CreateContactDto } from './create-contact.dto';

export class UpdateContactDto extends OmitType(CreateContactDto,["key"]) {

@ApiProperty()
@IsNotEmpty()
@IsBoolean()
isActive: boolean;

}
