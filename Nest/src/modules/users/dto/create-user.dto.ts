/**
 * DTO for creating a new user.
 * Validates required fields for user registration.
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
export class CreateUserDto {
  /**
   * User's first name, 1-50 characters.
   */
  @ApiProperty({ description: 'First name', minLength: 1, maxLength: 50 })
  @Field()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  firstName: string;

  /**
   * User's last name, 1-50 characters.
   */
  @ApiProperty({ description: 'Last name', minLength: 1, maxLength: 50 })
  @Field()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  lastName: string;

  /**
   * Unique nickname, 1-30 characters.
   */
  @ApiProperty({ description: 'Unique nickname', minLength: 1, maxLength: 30 })
  @Field()
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  nickname: string;

  /**
   * Valid email address.
   */
  @ApiProperty({ description: 'Email address' })
  @Field()
  @IsEmail()
  email: string;

  /**
   * Password, minimum 6 characters.
   */
  @ApiProperty({ description: 'Password', minLength: 6 })
  @Field()
  @IsString()
  @MinLength(6)
  password: string;

  /**
   * Date of birth in ISO format (YYYY-MM-DD).
   */
  @ApiProperty({ description: 'Birthdate in ISO format' })
  @Field()
  @IsDateString()
  birthdate: string;

  /**
   * Optional location, max 100 characters.
   */
  @ApiPropertyOptional({ description: 'Location', maxLength: 100 })
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  location?: string;

  /**
   * Optional gender, max 20 characters.
   */
  @ApiPropertyOptional({ description: 'Gender', maxLength: 20 })
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  gender?: string;

  /**
   * Optional job title, max 100 characters.
   */
  @ApiPropertyOptional({ description: 'Job title', maxLength: 100 })
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  jobTitle?: string;

  /**
   * Optional phone number, max 20 characters.
   */
  @ApiPropertyOptional({ description: 'Phone number', maxLength: 20 })
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;
}
