/**
 * Application service providing health check and database reset functionality.
 * Executes SQL scripts for database initialization.
 */

import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class AppService {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * Returns health status of the API.
   * @returns Health status object
   */
  getHealth(): { status: string; message: string } {
    return {
      status: 'healthy',
      message: 'API is running',
    };
  }

  /**
   * Resets the database by dropping and recreating tables.
   * Loads schema and dummy data from SQL files.
   * @returns Success message
   */
  async resetDatabase(): Promise<{ message: string }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      // Drop existing tables in correct order
      await queryRunner.query('DROP TABLE IF EXISTS posts_tags CASCADE');
      await queryRunner.query('DROP TABLE IF EXISTS posts CASCADE');
      await queryRunner.query('DROP TABLE IF EXISTS tags CASCADE');
      await queryRunner.query('DROP TABLE IF EXISTS users CASCADE');
      await queryRunner.query('DROP FUNCTION IF EXISTS update_updated_at_column CASCADE');

      // Read and execute schema SQL
      const schemaPath = join(__dirname, '..', '..', 'SQL', 'schema.sql');
      const schemaSql = readFileSync(schemaPath, 'utf8');
      const schemaStatements = schemaSql
        .split(';')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      for (const statement of schemaStatements) {
        await queryRunner.query(statement);
      }

      // Read and execute dummy data SQL
      const dummyDataPath = join(__dirname, '..', '..', 'SQL', 'dummy_data.sql');
      const dummyDataSql = readFileSync(dummyDataPath, 'utf8');
      const dataStatements = dummyDataSql
        .split(';')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      for (const statement of dataStatements) {
        await queryRunner.query(statement);
      }

      return { message: 'Database reset successfully' };
    } finally {
      await queryRunner.release();
    }
  }
}
