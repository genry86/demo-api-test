/**
 * DTO for creating a new tag.
 * Validates required fields for tag creation.
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

@InputType()
export class CreateTagDto {
  /**
   * Tag title, 1-50 characters.
   */
  @ApiProperty({ description: 'Tag title', minLength: 1, maxLength: 50 })
  @Field()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  title: string;

  /**
   * Optional tag description.
   */
  @ApiPropertyOptional({ description: 'Tag description' })
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;
}
