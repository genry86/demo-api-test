/**
 * GraphQL resolver for User queries and mutations.
 * Provides GraphQL interface for user management operations.
 */

import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { User } from '../../entities';
import { UsersService } from '../users/users.service';
import { CreateUserDto, UpdateUserDto, SearchUserDto } from '../users/dto';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Query to get a user by ID.
   * @param id - User ID
   * @param includePosts - Whether to include posts
   * @returns User entity
   */
  @Query(() => User, { name: 'user', nullable: true })
  async getUser(
    @Args('id', { type: () => Int }) id: number,
    @Args('includePosts', { type: () => Boolean, defaultValue: true }) includePosts: boolean,
  ): Promise<User> {
    return this.usersService.findOne(id, includePosts);
  }

  /**
   * Query to search users with filters.
   * @param searchParams - Search criteria
   * @returns Array of matching users
   */
  @Query(() => [User], { name: 'users' })
  async getUsers(
    @Args('searchParams', { type: () => SearchUserDto, nullable: true }) searchParams?: SearchUserDto,
  ): Promise<User[]> {
    return this.usersService.search(searchParams || new SearchUserDto());
  }

  /**
   * Mutation to create a new user.
   * @param userData - User creation data
   * @returns Created user
   */
  @Mutation(() => User)
  async createUser(
    @Args('userData', { type: () => CreateUserDto }) userData: CreateUserDto,
  ): Promise<User> {
    return this.usersService.create(userData);
  }

  /**
   * Mutation to update an existing user.
   * @param id - User ID
   * @param userData - Fields to update
   * @returns Updated user
   */
  @Mutation(() => User, { nullable: true })
  async updateUser(
    @Args('id', { type: () => Int }) id: number,
    @Args('userData', { type: () => UpdateUserDto }) userData: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, userData);
  }

  /**
   * Mutation to delete a user.
   * @param id - User ID
   * @returns Success status
   */
  @Mutation(() => Boolean)
  async deleteUser(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.usersService.remove(id);
    return true;
  }
}
