/**
 * Tags controller providing REST API endpoints for tag management.
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
import { TagsService } from './tags.service';
import { CreateTagDto, UpdateTagDto } from './dto';
import { Tag } from '../../entities';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  /**
   * Creates a new tag.
   * @param createTagDto - Tag creation data
   * @returns Created tag
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new tag' })
  @ApiResponse({ status: 201, description: 'Tag created successfully', type: Tag })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(@Body() createTagDto: CreateTagDto): Promise<Tag> {
    return this.tagsService.create(createTagDto);
  }

  /**
   * Gets all tags.
   * @param includePosts - Whether to include posts
   * @returns Array of all tags
   */
  @Get()
  @ApiOperation({ summary: 'Get all tags' })
  @ApiQuery({ name: 'includePosts', required: false, type: Boolean, description: 'Include associated posts' })
  @ApiResponse({ status: 200, description: 'Tags retrieved', type: [Tag] })
  async findAll(@Query('includePosts') includePosts?: string): Promise<Tag[]> {
    // Parse boolean from query string
    const includePostsBool = includePosts === 'true';
    return this.tagsService.findAll(includePostsBool);
  }

  /**
   * Gets a tag by ID.
   * @param id - Tag ID
   * @param includePosts - Whether to include posts
   * @returns Tag entity
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get tag by ID' })
  @ApiParam({ name: 'id', description: 'Tag ID' })
  @ApiQuery({ name: 'includePosts', required: false, type: Boolean, description: 'Include associated posts' })
  @ApiResponse({ status: 200, description: 'Tag found', type: Tag })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('includePosts') includePosts?: string,
  ): Promise<Tag> {
    // Parse boolean from query string
    const includePostsBool = includePosts !== 'false';
    return this.tagsService.findOne(id, includePostsBool);
  }

  /**
   * Updates an existing tag.
   * @param id - Tag ID
   * @param updateTagDto - Fields to update
   * @returns Updated tag
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update tag by ID' })
  @ApiParam({ name: 'id', description: 'Tag ID' })
  @ApiResponse({ status: 200, description: 'Tag updated successfully', type: Tag })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTagDto: UpdateTagDto,
  ): Promise<Tag> {
    return this.tagsService.update(id, updateTagDto);
  }

  /**
   * Deletes a tag by ID.
   * @param id - Tag ID
   * @returns Success message
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete tag by ID' })
  @ApiParam({ name: 'id', description: 'Tag ID' })
  @ApiResponse({ status: 200, description: 'Tag deleted successfully' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.tagsService.remove(id);
  }
}
