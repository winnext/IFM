import { CreateClassificationDto } from './create-classification.dto';
declare const UpdateClassificationDto_base: import("@nestjs/common").Type<Partial<CreateClassificationDto>>;
export declare class UpdateClassificationDto extends UpdateClassificationDto_base {
    labeltags: string[];
}
export {};
