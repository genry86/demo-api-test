/**
 * Users controller providing REST API endpoints for user management.
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
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, SearchUserDto } from './dto';
import { User } from '../../entities';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Creates a new user.
   * @param createUserDto - User creation data
   * @returns Created user
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully', type: User })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  /**
   * Gets a user by ID.
   * @param id - User ID
   * @param includePosts - Whether to include posts
   * @returns User entity
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiQuery({ name: 'includePosts', required: false, type: Boolean, description: 'Include user posts' })
  @ApiResponse({ status: 200, description: 'User found', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('includePosts') includePosts?: string,
  ): Promise<User> {
    // Parse boolean from query string
    const includePostsBool = includePosts !== 'false';
    return this.usersService.findOne(id, includePostsBool);
  }

  /**
   * Searches users with optional filters.
   * @param searchDto - Search criteria
   * @returns Array of matching users
   */
  @Get()
  @ApiOperation({ summary: 'Search users with filters' })
  @ApiResponse({ status: 200, description: 'Users retrieved', type: [User] })
  async search(@Query() searchDto: SearchUserDto): Promise<User[]> {
    return this.usersService.search(searchDto);
  }

  /**
   * Updates an existing user.
   * @param id - User ID
   * @param updateUserDto - Fields to update
   * @returns Updated user
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * Deletes a user by ID.
   * @param id - User ID
   * @returns Success message
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.usersService.remove(id);
  }
}
