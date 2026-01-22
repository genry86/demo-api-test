/**
 * DTO for creating a new post.
 * Validates required fields for post creation.
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
export class CreatePostDto {
  /**
   * Post title, 1-200 characters.
   */
  @ApiProperty({ description: 'Post title', minLength: 1, maxLength: 200 })
  @Field()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  /**
   * Full content of the post.
   */
  @ApiProperty({ description: 'Post content' })
  @Field()
  @IsString()
  content: string;

  /**
   * Whether the post should be published.
   */
  @ApiPropertyOptional({ description: 'Is published', default: true })
  @Field(() => Boolean, { nullable: true, defaultValue: true })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean = true;

  /**
   * List of tag IDs to associate with the post.
   */
  @ApiPropertyOptional({ description: 'Tag IDs to associate', type: [Number] })
  @Field(() => [Int], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tagIds?: number[];
}
