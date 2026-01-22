/**
 * DTO for post search with filters and pagination.
 * All filter fields are optional.
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsBoolean, IsInt, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class SearchPostDto {
  /**
   * Filter by title (partial match).
   */
  @ApiPropertyOptional({ description: 'Filter by title (partial match)' })
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  title?: string;

  /**
   * Filter by content (partial match).
   */
  @ApiPropertyOptional({ description: 'Filter by content (partial match)' })
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  content?: string;

  /**
   * Include author data in response.
   */
  @ApiPropertyOptional({ description: 'Include author in response', default: true })
  @Field(() => Boolean, { nullable: true, defaultValue: true })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  includeAuthor?: boolean = true;

  /**
   * Include tags in response.
   */
  @ApiPropertyOptional({ description: 'Include tags in response', default: false })
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  includeTags?: boolean = false;

  /**
   * Number of records to skip for pagination.
   */
  @ApiPropertyOptional({ description: 'Records to skip', default: 0, minimum: 0 })
  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  skip?: number = 0;

  /**
   * Maximum number of records to return.
   */
  @ApiPropertyOptional({ description: 'Max records to return', default: 100, minimum: 1, maximum: 1000 })
  @Field(() => Int, { nullable: true, defaultValue: 100 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1000)
  @Type(() => Number)
  limit?: number = 100;
}
