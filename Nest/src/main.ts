/**
 * Application entry point.
 * Bootstraps NestJS application with Swagger documentation.
 * Configures validation pipes and CORS settings.
 */

import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

// Server configuration constants
const PORT = 8000;
const API_TITLE = 'Demo NestJS API';
const API_DESCRIPTION = 'REST and GraphQL API for managing users, posts, and tags';
const API_VERSION = '1.0.0';

/**
 * Bootstrap function to initialize and start the application.
 * Configures validation, Swagger documentation, and starts the server.
 */
async function bootstrap(): Promise<void> {
  // Create NestJS application
  const app = await NestFactory.create(AppModule);

  // Enable global validation pipe for DTO validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Enable CORS for all origins
  app.enableCors();

  // Configure Swagger documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle(API_TITLE)
    .setDescription(API_DESCRIPTION)
    .setVersion(API_VERSION)
    .addTag('users', 'User management endpoints')
    .addTag('posts', 'Post management endpoints')
    .addTag('tags', 'Tag management endpoints')
    .addTag('utility', 'Utility endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  // Start the server
  await app.listen(PORT);

  console.log(`Application is running on: http://localhost:${PORT}`);
  console.log(`Swagger docs available at: http://localhost:${PORT}/docs`);
  console.log(`GraphQL playground at: http://localhost:${PORT}/graphql`);
}

bootstrap();
