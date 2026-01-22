/**
 * DTO for updating an existing post.
 * All fields are optional for partial updates.
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsString,
  IsBoolean,
  IsArray,
  IsInt,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';

@InputType()
export class UpdatePostDto {
  /**
   * Updated post title, 1-200 characters.
   */
  @ApiPropertyOptional({ description: 'Post title', minLength: 1, maxLength: 200 })
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title?: string;

  /**
   * Updated post content.
   */
  @ApiPropertyOptional({ description: 'Post content' })
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  content?: string;

  /**
   * Updated publish status.
   */
  @ApiPropertyOptional({ description: 'Is published' })
  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  /**
   * Updated list of tag IDs.
   */
  @ApiPropertyOptional({ description: 'Tag IDs to associate', type: [Number] })
  @Field(() => [Int], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tagIds?: number[];
}
