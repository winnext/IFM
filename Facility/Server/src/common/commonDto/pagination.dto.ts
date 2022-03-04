import { IsNumber, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
 
export class PaginationParams {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;
 
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;
}