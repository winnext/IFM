import { IsNumber, Min, IsOptional, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ClassNames } from '../const/classname.enum';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Common Pagination DTO for all  APIs
 */
export class PaginationNeo4jParams {
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

  /**
   * Class name(for example: Classification)
   */
  @ApiProperty({
   enum:ClassNames
  })
  @IsOptional()
  @IsEnum(ClassNames)
  class_name?: ClassNames;
}
