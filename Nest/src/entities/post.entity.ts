/**
 * Post entity representing the posts table in the database.
 * Contains blog post data with relationships to author and tags.
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from './user.entity';
import { Tag } from './tag.entity';

@ObjectType()
@Entity('posts')
export class Post {
  /**
   * Unique identifier for the post.
   */
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Foreign key reference to the author user.
   */
  @Field(() => Int)
  @Column({ name: 'author_id' })
  authorId: number;

  /**
   * Post title, max 200 characters.
   */
  @Field()
  @Column({ length: 200 })
  title: string;

  /**
   * Full content of the post.
   */
  @Field()
  @Column({ type: 'text' })
  content: string;

  /**
   * Timestamp when the post was created.
   */
  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  /**
   * Rating score for the post, defaults to 0.
   */
  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  rating: number;

  /**
   * View count for the post, defaults to 0.
   */
  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  views: number;

  /**
   * Whether the post is publicly visible.
   */
  @Field()
  @Column({ name: 'is_published', type: 'boolean', default: true })
  isPublished: boolean;

  /**
   * Timestamp when the post was last updated.
   */
  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  /**
   * Author of the post.
   * Many-to-one relationship with User entity.
   */
  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author?: User;

  /**
   * Tags associated with this post.
   * Many-to-many relationship through posts_tags table.
   */
  @Field(() => [Tag], { nullable: true })
  @ManyToMany(() => Tag, (tag) => tag.posts)
  @JoinTable({
    name: 'posts_tags',
    joinColumn: { name: 'post_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags?: Tag[];
}
