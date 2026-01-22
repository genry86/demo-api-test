/**
 * Tags service providing CRUD operations for tag management.
 * Uses TypeORM repository pattern for database operations.
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../../entities';
import { CreateTagDto, UpdateTagDto } from './dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  /**
   * Creates a new tag with the provided data.
   * @param createTagDto - Tag creation data
   * @returns Created tag entity
   */
  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const tag = this.tagRepository.create({
      title: createTagDto.title,
      description: createTagDto.description,
    });
    return this.tagRepository.save(tag);
  }

  /**
   * Retrieves all tags from the database.
   * @param includePosts - Whether to include associated posts
   * @returns Array of all tags
   */
  async findAll(includePosts: boolean = false): Promise<Tag[]> {
    const relations = includePosts ? ['posts'] : [];
    return this.tagRepository.find({ relations });
  }

  /**
   * Retrieves a tag by ID with optional posts.
   * @param id - Tag ID
   * @param includePosts - Whether to include associated posts
   * @returns Tag entity
   */
  async findOne(id: number, includePosts: boolean = true): Promise<Tag> {
    const relations = includePosts ? ['posts'] : [];
    const tag = await this.tagRepository.findOne({
      where: { id },
      relations,
    });

    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }

    return tag;
  }

  /**
   * Updates an existing tag with partial data.
   * @param id - Tag ID to update
   * @param updateTagDto - Fields to update
   * @returns Updated tag entity
   */
  async update(id: number, updateTagDto: UpdateTagDto): Promise<Tag> {
    const tag = await this.findOne(id, false);

    // Apply updates only for provided fields
    if (updateTagDto.title !== undefined) tag.title = updateTagDto.title;
    if (updateTagDto.description !== undefined) tag.description = updateTagDto.description;

    return this.tagRepository.save(tag);
  }

  /**
   * Deletes a tag by ID.
   * @param id - Tag ID to delete
   * @returns Success message
   */
  async remove(id: number): Promise<{ message: string }> {
    const tag = await this.findOne(id, false);
    await this.tagRepository.remove(tag);
    return { message: `Tag ${id} deleted successfully` };
  }
}
