/**
 * Database configuration for TypeORM.
 * Loads connection settings from environment variables with fallback defaults.
 */

import * as dotenv from 'dotenv';
import { join } from 'path';

// Load environment variables from parent directory .env file
dotenv.config({ path: join(__dirname, '../../..', '.env') });

// Database connection constants
export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_PORT = parseInt(process.env.DB_PORT || '5432', 10);
export const DB_USER = process.env.DB_USER || 'postgres';
export const DB_PASSWORD = process.env.DB_PASSWORD || '';
export const DB_NAME = process.env.DB_NAME || 'DemoApiTest';

/**
 * TypeORM configuration object for PostgreSQL connection.
 * Used by the TypeOrmModule in the app module.
 */
export const typeOrmConfig = {
  type: 'postgres' as const,
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  // Entities are loaded automatically from the entities folder
  autoLoadEntities: true,
  // Set to false in production to prevent auto-schema changes
  synchronize: false,
  // Enable logging for debugging (set to false in production)
  logging: false,
};
