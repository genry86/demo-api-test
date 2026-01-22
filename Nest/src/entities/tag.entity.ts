/**
 * Tag entity representing the tags table in the database.
 * Used for categorizing and organizing posts.
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Post } from './post.entity';

@ObjectType()
@Entity('tags')
export class Tag {
  /**
   * Unique identifier for the tag.
   */
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Unique tag title, max 50 characters.
   */
  @Field()
  @Column({ length: 50, unique: true })
  title: string;

  /**
   * Optional description of the tag.
   */
  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  description: string | null;

  /**
   * Timestamp when the tag was created.
   */
  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  /**
   * Posts associated with this tag.
   * Many-to-many relationship through posts_tags table.
   */
  @Field(() => [Post], { nullable: true })
  @ManyToMany(() => Post, (post) => post.tags)
  posts?: Post[];
}
