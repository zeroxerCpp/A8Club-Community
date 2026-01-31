import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommunityStats } from '../entities/community-stats.entity';
import { CreateStatsDto, UpdateStatsDto } from './dto/stats.dto';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(CommunityStats)
    private statsRepository: Repository<CommunityStats>,
  ) {}

  async create(createStatsDto: CreateStatsDto): Promise<CommunityStats> {
    const stats = this.statsRepository.create(createStatsDto);
    return await this.statsRepository.save(stats);
  }

  async getLatest(): Promise<CommunityStats | null> {
    const stats = await this.statsRepository.find({
      order: { createdAt: 'DESC' },
      take: 1,
    });
    return stats.length > 0 ? stats[0] : null;
  }

  async update(updateStatsDto: UpdateStatsDto): Promise<CommunityStats> {
    // 获取最新的统计数据或创建新的
    let stats = await this.getLatest();
    
    if (!stats) {
      return await this.create(updateStatsDto as CreateStatsDto);
    }

    Object.assign(stats, updateStatsDto);
    return await this.statsRepository.save(stats);
  }

  async getHistory(limit: number = 10): Promise<CommunityStats[]> {
    return await this.statsRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
