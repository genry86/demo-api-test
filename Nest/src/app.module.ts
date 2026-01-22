/**
 * Root application module.
 * Configures TypeORM, imports all feature modules, and sets up database reset endpoint.
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config';
import { User, Post, Tag } from './entities';
import { UsersModule } from './modules/users';
import { PostsModule } from './modules/posts';
import { TagsModule } from './modules/tags';
import { GraphqlModule } from './modules/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Configure TypeORM with PostgreSQL
    TypeOrmModule.forRoot({
      ...typeOrmConfig,
      entities: [User, Post, Tag],
    }),
    // Feature modules
    UsersModule,
    PostsModule,
    TagsModule,
    GraphqlModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
