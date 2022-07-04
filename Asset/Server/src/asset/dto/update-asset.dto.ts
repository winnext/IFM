import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { CreateAssetDto } from './create-asset.dto';



export class UpdateAssetDto extends PartialType(CreateAssetDto) {

@ApiProperty()
@IsNotEmpty()
@IsBoolean()
isActive: boolean;

}
