import { Controller, Get, Post, Body, Patch, UseGuards, Query } from '@nestjs/common';
import { StatsService } from './stats.service';
import { CreateStatsDto, UpdateStatsDto } from './dto/stats.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createStatsDto: CreateStatsDto) {
    return this.statsService.create(createStatsDto);
  }

  @Get('latest')
  getLatest() {
    return this.statsService.getLatest();
  }

  @Get('history')
  getHistory(@Query('limit') limit?: number) {
    return this.statsService.getHistory(limit);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  update(@Body() updateStatsDto: UpdateStatsDto) {
    return this.statsService.update(updateStatsDto);
  }
}
