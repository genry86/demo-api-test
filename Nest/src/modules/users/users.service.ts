/**
 * Users service providing CRUD operations for user management.
 * Uses TypeORM repository pattern for database operations.
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { User } from '../../entities';
import { CreateUserDto, UpdateUserDto, SearchUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Creates a new user with the provided data.
   * @param createUserDto - User creation data
   * @returns Created user entity
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      nickname: createUserDto.nickname,
      email: createUserDto.email,
      password: createUserDto.password,
      birthdate: new Date(createUserDto.birthdate),
      location: createUserDto.location,
      gender: createUserDto.gender,
      jobTitle: createUserDto.jobTitle,
      phone: createUserDto.phone,
    });
    return this.userRepository.save(user);
  }

  /**
   * Retrieves a user by ID with optional posts.
   * @param id - User ID
   * @param includePosts - Whether to include user's posts
   * @returns User entity or null
   */
  async findOne(id: number, includePosts: boolean = true): Promise<User> {
    const relations = includePosts ? ['posts'] : [];
    const user = await this.userRepository.findOne({
      where: { id },
      relations,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  /**
   * Searches users with optional filters and pagination.
   * @param searchDto - Search criteria and pagination
   * @returns Array of matching users
   */
  async search(searchDto: SearchUserDto): Promise<User[]> {
    const {
      nickname,
      email,
      location,
      jobTitle,
      includePosts = false,
      skip = 0,
      limit = 100,
    } = searchDto;

    const where: Record<string, unknown>[] = [];

    // Build filter conditions using OR logic
    if (nickname) {
      where.push({ nickname: ILike(`%${nickname}%`) });
    }
    if (email) {
      where.push({ email: ILike(`%${email}%`) });
    }
    if (location) {
      where.push({ location: ILike(`%${location}%`) });
    }
    if (jobTitle) {
      where.push({ jobTitle: ILike(`%${jobTitle}%`) });
    }

    const relations = includePosts ? ['posts'] : [];

    return this.userRepository.find({
      where: where.length > 0 ? where : undefined,
      relations,
      skip,
      take: limit,
    });
  }

  /**
   * Updates an existing user with partial data.
   * @param id - User ID to update
   * @param updateUserDto - Fields to update
   * @returns Updated user entity
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id, false);

    // Apply updates only for provided fields
    if (updateUserDto.firstName !== undefined) user.firstName = updateUserDto.firstName;
    if (updateUserDto.lastName !== undefined) user.lastName = updateUserDto.lastName;
    if (updateUserDto.nickname !== undefined) user.nickname = updateUserDto.nickname;
    if (updateUserDto.email !== undefined) user.email = updateUserDto.email;
    if (updateUserDto.password !== undefined) user.password = updateUserDto.password;
    if (updateUserDto.birthdate !== undefined) user.birthdate = new Date(updateUserDto.birthdate);
    if (updateUserDto.location !== undefined) user.location = updateUserDto.location;
    if (updateUserDto.gender !== undefined) user.gender = updateUserDto.gender;
    if (updateUserDto.jobTitle !== undefined) user.jobTitle = updateUserDto.jobTitle;
    if (updateUserDto.phone !== undefined) user.phone = updateUserDto.phone;

    return this.userRepository.save(user);
  }

  /**
   * Deletes a user by ID.
   * @param id - User ID to delete
   * @returns Success message
   */
  async remove(id: number): Promise<{ message: string }> {
    const user = await this.findOne(id, false);
    await this.userRepository.remove(user);
    return { message: `User ${id} deleted successfully` };
  }
}
