/**
 * DTO for user search with filters and pagination.
 * All filter fields are optional.
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsBoolean, IsInt, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class SearchUserDto {
  /**
   * Filter by nickname (partial match).
   */
  @ApiPropertyOptional({ description: 'Filter by nickname (partial match)' })
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  nickname?: string;

  /**
   * Filter by email (partial match).
   */
  @ApiPropertyOptional({ description: 'Filter by email (partial match)' })
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  email?: string;

  /**
   * Filter by location (partial match).
   */
  @ApiPropertyOptional({ description: 'Filter by location (partial match)' })
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  location?: string;

  /**
   * Filter by job title (partial match).
   */
  @ApiPropertyOptional({ description: 'Filter by job title (partial match)' })
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  jobTitle?: string;

  /**
   * Include user's posts in response.
   */
  @ApiPropertyOptional({ description: 'Include posts in response', default: false })
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  includePosts?: boolean = false;

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
