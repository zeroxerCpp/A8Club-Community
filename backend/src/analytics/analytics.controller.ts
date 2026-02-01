import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('track')
  async track(@Body() body: { path: string; referrer?: string }) {
    // 在实际应用中，应该从请求中获取IP和userAgent
    return this.analyticsService.trackPageView({
      path: body.path,
      referrer: body.referrer,
      userAgent: '',
      ip: '',
    });
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getStats(@Query('days') days?: string) {
    return this.analyticsService.getStats(days ? parseInt(days) : 7);
  }

  @Get('daily')
  @UseGuards(JwtAuthGuard)
  async getDailyStats(@Query('days') days?: string) {
    return this.analyticsService.getDailyStats(days ? parseInt(days) : 30);
  }

  @Get('pages')
  @UseGuards(JwtAuthGuard)
  async getTopPages(@Query('limit') limit?: string) {
    return this.analyticsService.getTopPages(limit ? parseInt(limit) : 10);
  }

  @Get('recent')
  @UseGuards(JwtAuthGuard)
  async getRecentVisitors(@Query('limit') limit?: string) {
    return this.analyticsService.getRecentVisitors(limit ? parseInt(limit) : 20);
  }
}
