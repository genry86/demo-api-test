/**
 * DTO for updating an existing tag.
 * All fields are optional for partial updates.
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

@InputType()
export class UpdateTagDto {
  /**
   * Updated tag title, 1-50 characters.
   */
  @ApiPropertyOptional({ description: 'Tag title', minLength: 1, maxLength: 50 })
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  title?: string;

  /**
   * Updated tag description.
   */
  @ApiPropertyOptional({ description: 'Tag description' })
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;
}
