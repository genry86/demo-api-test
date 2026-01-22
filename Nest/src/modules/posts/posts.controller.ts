/**
 * Posts controller providing REST API endpoints for post management.
 * Implements CRUD operations with Swagger documentation.
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto, SearchPostDto } from './dto';
import { Post as PostEntity } from '../../entities';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * Creates a new post for the specified author.
   * @param authorId - Author ID from query
   * @param createPostDto - Post creation data
   * @returns Created post
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new post' })
  @ApiQuery({ name: 'authorId', required: true, type: Number, description: 'Author ID' })
  @ApiResponse({ status: 201, description: 'Post created successfully', type: PostEntity })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Author not found' })
  async create(
    @Query('authorId', ParseIntPipe) authorId: number,
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostEntity> {
    return this.postsService.create(authorId, createPostDto);
  }

  /**
   * Gets a post by ID.
   * @param id - Post ID
   * @param includeAuthor - Whether to include author
   * @param includeTags - Whether to include tags
   * @returns Post entity
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get post by ID' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiQuery({ name: 'includeAuthor', required: false, type: Boolean, description: 'Include author data' })
  @ApiQuery({ name: 'includeTags', required: false, type: Boolean, description: 'Include tags' })
  @ApiResponse({ status: 200, description: 'Post found', type: PostEntity })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('includeAuthor') includeAuthor?: string,
    @Query('includeTags') includeTags?: string,
  ): Promise<PostEntity> {
    // Parse booleans from query strings
    const includeAuthorBool = includeAuthor !== 'false';
    const includeTagsBool = includeTags !== 'false';
    return this.postsService.findOne(id, includeAuthorBool, includeTagsBool);
  }

  /**
   * Searches posts with optional filters.
   * @param searchDto - Search criteria
   * @returns Array of matching posts
   */
  @Get()
  @ApiOperation({ summary: 'Search posts with filters' })
  @ApiResponse({ status: 200, description: 'Posts retrieved', type: [PostEntity] })
  async search(@Query() searchDto: SearchPostDto): Promise<PostEntity[]> {
    return this.postsService.search(searchDto);
  }

  /**
   * Updates an existing post.
   * @param id - Post ID
   * @param updatePostDto - Fields to update
   * @returns Updated post
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update post by ID' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({ status: 200, description: 'Post updated successfully', type: PostEntity })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostEntity> {
    return this.postsService.update(id, updatePostDto);
  }

  /**
   * Deletes a post by ID.
   * @param id - Post ID
   * @returns Success message
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete post by ID' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({ status: 200, description: 'Post deleted successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.postsService.remove(id);
  }
}
