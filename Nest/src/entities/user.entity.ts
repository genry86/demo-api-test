/**
 * User entity representing the users table in the database.
 * Contains user profile information and relationship to posts.
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Post } from './post.entity';

@ObjectType()
@Entity('users')
export class User {
  /**
   * Unique identifier for the user.
   */
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * User's first name, max 50 characters.
   */
  @Field()
  @Column({ name: 'first_name', length: 50 })
  firstName: string;

  /**
   * User's last name, max 50 characters.
   */
  @Field()
  @Column({ name: 'last_name', length: 50 })
  lastName: string;

  /**
   * Unique nickname for the user, max 30 characters.
   */
  @Field()
  @Column({ length: 30, unique: true })
  nickname: string;

  /**
   * Hashed password for user authentication.
   */
  @Column({ length: 255 })
  password: string;

  /**
   * Unique email address for the user, max 100 characters.
   */
  @Field()
  @Column({ length: 100, unique: true })
  email: string;

  /**
   * User's date of birth.
   */
  @Field()
  @Column({ type: 'date' })
  birthdate: Date;

  /**
   * Optional location/address, max 100 characters.
   */
  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  location: string | null;

  /**
   * Optional gender information, max 20 characters.
   */
  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  gender: string | null;

  /**
   * Optional job title, max 100 characters.
   */
  @Field(() => String, { nullable: true })
  @Column({ name: 'job_title', type: 'varchar', length: 100, nullable: true })
  jobTitle: string | null;

  /**
   * Optional phone number, max 20 characters.
   */
  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  /**
   * Timestamp when the user was created.
   */
  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  /**
   * Posts authored by this user.
   * Relationship with cascade delete enabled.
   */
  @Field(() => [Post], { nullable: true })
  @OneToMany(() => Post, (post) => post.author, { cascade: true })
  posts?: Post[];
}
