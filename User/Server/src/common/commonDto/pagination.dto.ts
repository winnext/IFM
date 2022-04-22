import { IsNumber, Min, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Common Pagination DTO for all  APIs
 */
export class PaginationParams {
  /**
   * Page number
   */
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  page?: number;

  /**
   * Limit number(how many items per page)
   */
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;

  /**
   * Order by(asc or desc)
   */
  @IsOptional()
  @Type(() => String)
  @IsString()
  orderBy?: string;

  /**
   * Order by Column(for example: createdAt)
   */
  @IsOptional()
  @Type(() => String)
  @IsString()
  orderByColumn?: string;
}
