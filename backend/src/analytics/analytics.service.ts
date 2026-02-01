import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageView } from '../entities/page-view.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(PageView)
    private pageViewRepository: Repository<PageView>,
  ) {}

  async trackPageView(data: {
    path: string;
    userAgent?: string;
    ip?: string;
    referrer?: string;
  }) {
    const pageView = this.pageViewRepository.create(data);
    return this.pageViewRepository.save(pageView);
  }

  async getStats(days: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const totalViews = await this.pageViewRepository.count();
    
    const recentViews = await this.pageViewRepository.count({
      where: {
        createdAt: new Date(startDate) as any,
      },
    });

    const uniqueVisitors = await this.pageViewRepository
      .createQueryBuilder('pv')
      .select('COUNT(DISTINCT pv.ip)', 'count')
      .where('pv.createdAt >= :startDate', { startDate })
      .getRawOne();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayViews = await this.pageViewRepository.count({
      where: {
        createdAt: new Date(today) as any,
      },
    });

    return {
      totalViews,
      recentViews,
      uniqueVisitors: parseInt(uniqueVisitors.count) || 0,
      todayViews,
    };
  }

  async getDailyStats(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const stats = await this.pageViewRepository
      .createQueryBuilder('pv')
      .select('DATE(pv.createdAt)', 'date')
      .addSelect('COUNT(*)', 'views')
      .addSelect('COUNT(DISTINCT pv.ip)', 'uniqueVisitors')
      .where('pv.createdAt >= :startDate', { startDate })
      .groupBy('DATE(pv.createdAt)')
      .orderBy('DATE(pv.createdAt)', 'ASC')
      .getRawMany();

    return stats;
  }

  async getTopPages(limit: number = 10) {
    const pages = await this.pageViewRepository
      .createQueryBuilder('pv')
      .select('pv.path', 'path')
      .addSelect('COUNT(*)', 'views')
      .groupBy('pv.path')
      .orderBy('COUNT(*)', 'DESC')
      .limit(limit)
      .getRawMany();

    return pages;
  }

  async getRecentVisitors(limit: number = 20) {
    return this.pageViewRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
