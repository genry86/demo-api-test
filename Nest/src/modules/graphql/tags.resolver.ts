/**
 * GraphQL resolver for Tag queries and mutations.
 * Provides GraphQL interface for tag management operations.
 */

import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Tag } from '../../entities';
import { TagsService } from '../tags/tags.service';
import { CreateTagDto, UpdateTagDto } from '../tags/dto';

@Resolver(() => Tag)
export class TagsResolver {
  constructor(private readonly tagsService: TagsService) {}

  /**
   * Query to get a tag by ID.
   * @param id - Tag ID
   * @param includePosts - Whether to include posts
   * @returns Tag entity
   */
  @Query(() => Tag, { name: 'tag', nullable: true })
  async getTag(
    @Args('id', { type: () => Int }) id: number,
    @Args('includePosts', { type: () => Boolean, defaultValue: true }) includePosts: boolean,
  ): Promise<Tag> {
    return this.tagsService.findOne(id, includePosts);
  }

  /**
   * Query to get all tags.
   * @param includePosts - Whether to include posts
   * @returns Array of all tags
   */
  @Query(() => [Tag], { name: 'tags' })
  async getTags(
    @Args('includePosts', { type: () => Boolean, defaultValue: false }) includePosts: boolean,
  ): Promise<Tag[]> {
    return this.tagsService.findAll(includePosts);
  }

  /**
   * Mutation to create a new tag.
   * @param tagData - Tag creation data
   * @returns Created tag
   */
  @Mutation(() => Tag)
  async createTag(
    @Args('tagData', { type: () => CreateTagDto }) tagData: CreateTagDto,
  ): Promise<Tag> {
    return this.tagsService.create(tagData);
  }

  /**
   * Mutation to update an existing tag.
   * @param id - Tag ID
   * @param tagData - Fields to update
   * @returns Updated tag
   */
  @Mutation(() => Tag, { nullable: true })
  async updateTag(
    @Args('id', { type: () => Int }) id: number,
    @Args('tagData', { type: () => UpdateTagDto }) tagData: UpdateTagDto,
  ): Promise<Tag> {
    return this.tagsService.update(id, tagData);
  }

  /**
   * Mutation to delete a tag.
   * @param id - Tag ID
   * @returns Success status
   */
  @Mutation(() => Boolean)
  async deleteTag(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.tagsService.remove(id);
    return true;
  }
}
