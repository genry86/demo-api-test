/**
 * Posts service providing CRUD operations for post management.
 * Handles post-tag relationships and author associations.
 */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, In } from 'typeorm';
import { Post, User, Tag } from '../../entities';
import { CreatePostDto, UpdatePostDto, SearchPostDto } from './dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  /**
   * Creates a new post for the specified author.
   * @param authorId - ID of the post author
   * @param createPostDto - Post creation data
   * @returns Created post entity
   */
  async create(authorId: number, createPostDto: CreatePostDto): Promise<Post> {
    // Verify author exists
    const author = await this.userRepository.findOne({ where: { id: authorId } });
    if (!author) {
      throw new NotFoundException(`Author with ID ${authorId} not found`);
    }

    // Create post entity
    const post = this.postRepository.create({
      authorId,
      title: createPostDto.title,
      content: createPostDto.content,
      isPublished: createPostDto.isPublished ?? true,
    });

    // Handle tag associations if provided
    if (createPostDto.tagIds && createPostDto.tagIds.length > 0) {
      const tags = await this.tagRepository.find({
        where: { id: In(createPostDto.tagIds) },
      });

      if (tags.length !== createPostDto.tagIds.length) {
        const foundIds = new Set(tags.map((t) => t.id));
        const missingIds = createPostDto.tagIds.filter((id) => !foundIds.has(id));
        throw new BadRequestException(`Tags not found: ${missingIds.join(', ')}`);
      }

      post.tags = tags;
    }

    return this.postRepository.save(post);
  }

  /**
   * Retrieves a post by ID with optional relations.
   * @param id - Post ID
   * @param includeAuthor - Whether to include author data
   * @param includeTags - Whether to include tags
   * @returns Post entity
   */
  async findOne(
    id: number,
    includeAuthor: boolean = true,
    includeTags: boolean = true,
  ): Promise<Post> {
    const relations: string[] = [];
    if (includeAuthor) relations.push('author');
    if (includeTags) relations.push('tags');

    const post = await this.postRepository.findOne({
      where: { id },
      relations,
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  /**
   * Searches posts with optional filters and pagination.
   * @param searchDto - Search criteria and pagination
   * @returns Array of matching posts
   */
  async search(searchDto: SearchPostDto): Promise<Post[]> {
    const {
      title,
      content,
      includeAuthor = true,
      includeTags = false,
      skip = 0,
      limit = 100,
    } = searchDto;

    const where: Record<string, unknown>[] = [];

    // Build filter conditions using OR logic
    if (title) {
      where.push({ title: ILike(`%${title}%`) });
    }
    if (content) {
      where.push({ content: ILike(`%${content}%`) });
    }

    const relations: string[] = [];
    if (includeAuthor) relations.push('author');
    if (includeTags) relations.push('tags');

    return this.postRepository.find({
      where: where.length > 0 ? where : undefined,
      relations,
      skip,
      take: limit,
    });
  }

  /**
   * Updates an existing post with partial data.
   * @param id - Post ID to update
   * @param updatePostDto - Fields to update
   * @returns Updated post entity
   */
  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.findOne(id, false, true);

    // Apply updates only for provided fields
    if (updatePostDto.title !== undefined) post.title = updatePostDto.title;
    if (updatePostDto.content !== undefined) post.content = updatePostDto.content;
    if (updatePostDto.isPublished !== undefined) post.isPublished = updatePostDto.isPublished;

    // Handle tag updates if provided
    if (updatePostDto.tagIds !== undefined) {
      if (updatePostDto.tagIds.length > 0) {
        const tags = await this.tagRepository.find({
          where: { id: In(updatePostDto.tagIds) },
        });

        if (tags.length !== updatePostDto.tagIds.length) {
          const foundIds = new Set(tags.map((t) => t.id));
          const missingIds = updatePostDto.tagIds.filter((id) => !foundIds.has(id));
          throw new BadRequestException(`Tags not found: ${missingIds.join(', ')}`);
        }

        post.tags = tags;
      } else {
        post.tags = [];
      }
    }

    return this.postRepository.save(post);
  }

  /**
   * Deletes a post by ID.
   * @param id - Post ID to delete
   * @returns Success message
   */
  async remove(id: number): Promise<{ message: string }> {
    const post = await this.findOne(id, false, false);
    await this.postRepository.remove(post);
    return { message: `Post ${id} deleted successfully` };
  }
}
