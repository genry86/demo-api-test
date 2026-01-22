/**
 * DTO for updating an existing user.
 * All fields are optional for partial updates.
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { InputType, Field } from '@nestjs/graphql';
import {
  IsString,
  IsEmail,
  IsDateString,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';

@InputType()
export class UpdateUserDto {
  /**
   * Updated first name, 1-50 characters.
   */
  @ApiPropertyOptional({ description: 'First name', minLength: 1, maxLength: 50 })
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  firstName?: string;

  /**
   * Updated last name, 1-50 characters.
   */
  @ApiPropertyOptional({ description: 'Last name', minLength: 1, maxLength: 50 })
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  lastName?: string;

  /**
   * Updated nickname, 1-30 characters.
   */
  @ApiPropertyOptional({ description: 'Unique nickname', minLength: 1, maxLength: 30 })
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  nickname?: string;

  /**
   * Updated email address.
   */
  @ApiPropertyOptional({ description: 'Email address' })
  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  /**
   * Updated password, minimum 6 characters.
   */
  @ApiPropertyOptional({ description: 'Password', minLength: 6 })
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  /**
   * Updated birthdate in ISO format.
   */
  @ApiPropertyOptional({ description: 'Birthdate in ISO format' })
  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  birthdate?: string;

  /**
   * Updated location, max 100 characters.
   */
  @ApiPropertyOptional({ description: 'Location', maxLength: 100 })
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  location?: string;

  /**
   * Updated gender, max 20 characters.
   */
  @ApiPropertyOptional({ description: 'Gender', maxLength: 20 })
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  gender?: string;

  /**
   * Updated job title, max 100 characters.
   */
  @ApiPropertyOptional({ description: 'Job title', maxLength: 100 })
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  jobTitle?: string;

  /**
   * Updated phone number, max 20 characters.
   */
  @ApiPropertyOptional({ description: 'Phone number', maxLength: 20 })
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;
}
