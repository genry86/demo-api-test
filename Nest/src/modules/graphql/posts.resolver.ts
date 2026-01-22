/**
 * GraphQL resolver for Post queries and mutations.
 * Provides GraphQL interface for post management operations.
 */

import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Post } from '../../entities';
import { PostsService } from '../posts/posts.service';
import { CreatePostDto, UpdatePostDto, SearchPostDto } from '../posts/dto';

@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  /**
   * Query to get a post by ID.
   * @param id - Post ID
   * @param includeAuthor - Whether to include author
   * @param includeTags - Whether to include tags
   * @returns Post entity
   */
  @Query(() => Post, { name: 'post', nullable: true })
  async getPost(
    @Args('id', { type: () => Int }) id: number,
    @Args('includeAuthor', { type: () => Boolean, defaultValue: true }) includeAuthor: boolean,
    @Args('includeTags', { type: () => Boolean, defaultValue: true }) includeTags: boolean,
  ): Promise<Post> {
    return this.postsService.findOne(id, includeAuthor, includeTags);
  }

  /**
   * Query to search posts with filters.
   * @param searchParams - Search criteria
   * @returns Array of matching posts
   */
  @Query(() => [Post], { name: 'posts' })
  async getPosts(
    @Args('searchParams', { type: () => SearchPostDto, nullable: true }) searchParams?: SearchPostDto,
  ): Promise<Post[]> {
    return this.postsService.search(searchParams || new SearchPostDto());
  }

  /**
   * Mutation to create a new post.
   * @param authorId - Author ID
   * @param postData - Post creation data
   * @returns Created post
   */
  @Mutation(() => Post)
  async createPost(
    @Args('authorId', { type: () => Int }) authorId: number,
    @Args('postData', { type: () => CreatePostDto }) postData: CreatePostDto,
  ): Promise<Post> {
    return this.postsService.create(authorId, postData);
  }

  /**
   * Mutation to update an existing post.
   * @param id - Post ID
   * @param postData - Fields to update
   * @returns Updated post
   */
  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Args('id', { type: () => Int }) id: number,
    @Args('postData', { type: () => UpdatePostDto }) postData: UpdatePostDto,
  ): Promise<Post> {
    return this.postsService.update(id, postData);
  }

  /**
   * Mutation to delete a post.
   * @param id - Post ID
   * @returns Success status
   */
  @Mutation(() => Boolean)
  async deletePost(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.postsService.remove(id);
    return true;
  }
}
