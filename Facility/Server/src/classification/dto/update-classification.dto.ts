import { PartialType } from '@nestjs/swagger';
import { CreateClassificationDto } from './create-classification.dto';

export class UpdateClassificationDto extends PartialType(CreateClassificationDto) {}
