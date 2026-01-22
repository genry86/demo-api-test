/**
 * Application controller providing health check and database reset endpoints.
 * Provides utility endpoints for API status and development operations.
 */

import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('utility')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Health check endpoint.
   * @returns Health status
   */
  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'API is healthy' })
  getHealth(): { status: string; message: string } {
    return this.appService.getHealth();
  }

  /**
   * Reset database to initial state with dummy data.
   * @returns Success message
   */
  @Get('reset')
  @ApiOperation({ summary: 'Reset database to initial state' })
  @ApiResponse({ status: 200, description: 'Database reset successfully' })
  async resetDatabase(): Promise<{ message: string }> {
    return this.appService.resetDatabase();
  }
}
