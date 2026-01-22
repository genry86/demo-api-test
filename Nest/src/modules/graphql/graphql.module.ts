/**
 * GraphQL module providing Apollo Server integration.
 * Bundles all resolvers and configures GraphQL endpoint.
 */

import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UsersModule } from '../users/users.module';
import { PostsModule } from '../posts/posts.module';
import { TagsModule } from '../tags/tags.module';
import { UsersResolver } from './users.resolver';
import { PostsResolver } from './posts.resolver';
import { TagsResolver } from './tags.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // Generate schema automatically from decorators
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      // Sort schema fields for better readability
      sortSchema: true,
      // Enable GraphQL Playground
      playground: true,
      // GraphQL endpoint path
      path: '/graphql',
    }),
    UsersModule,
    PostsModule,
    TagsModule,
  ],
  providers: [UsersResolver, PostsResolver, TagsResolver],
})
export class GraphqlModule {}
