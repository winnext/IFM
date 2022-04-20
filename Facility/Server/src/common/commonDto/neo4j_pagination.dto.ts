import { IsNumber, Min, IsOptional, IsString } from 'class-validator';
import {Integer, int}  from 'neo4j-driver';
export class PaginationParams {
  @IsOptional()
  @IsNumber()
  @Min(0)
  page?: Integer;

  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: Integer;

  @IsOptional()
  @IsString()
  orderBy?: string;

  @IsOptional()
  @IsString()
  orderByColumn?: string;
}
