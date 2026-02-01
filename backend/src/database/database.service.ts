import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Founder } from '../entities/founder.entity';
import { Project } from '../entities/project.entity';
import { News } from '../entities/news.entity';
import { CommunityStats } from '../entities/community-stats.entity';
import { FriendLink } from '../entities/friend-link.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(Founder)
    private foundersRepository: Repository<Founder>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(News)
    private newsRepository: Repository<News>,
    @InjectRepository(CommunityStats)
    private statsRepository: Repository<CommunityStats>,
    @InjectRepository(FriendLink)
    private friendLinksRepository: Repository<FriendLink>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async exportAllData() {
    const [founders, projects, news, stats, friendLinks, users] =
      await Promise.all([
        this.foundersRepository.find(),
        this.projectsRepository.find(),
        this.newsRepository.find(),
        this.statsRepository.find(),
        this.friendLinksRepository.find(),
        this.usersRepository.find(),
      ]);

    // 移除敏感信息
    const sanitizedUsers = users.map(({ password, ...user }) => user);

    return {
      exportDate: new Date().toISOString(),
      version: '1.0',
      tables: {
        founders,
        projects,
        news,
        stats,
        friendLinks,
        users: sanitizedUsers,
      },
    };
  }

  async importData(data: any) {
    // 验证数据格式
    if (!data.tables) {
      throw new Error('无效的备份文件格式');
    }

    const result = {
      founders: 0,
      projects: 0,
      news: 0,
      stats: 0,
      friendLinks: 0,
      errors: [] as string[],
    };

    // 导入创始人
    if (data.tables.founders && Array.isArray(data.tables.founders)) {
      for (const founder of data.tables.founders) {
        try {
          // 转换日期字段
          const cleanData = {
            ...founder,
            createdAt: founder.createdAt ? new Date(founder.createdAt) : undefined,
            updatedAt: founder.updatedAt ? new Date(founder.updatedAt) : undefined,
          };
          await this.foundersRepository.save(cleanData);
          result.founders++;
        } catch (error) {
          result.errors.push(`创始人 ${founder.name}: ${error.message}`);
        }
      }
    }

    // 导入项目
    if (data.tables.projects && Array.isArray(data.tables.projects)) {
      for (const project of data.tables.projects) {
        try {
          const cleanData = {
            ...project,
            startDate: project.startDate ? new Date(project.startDate) : undefined,
            endDate: project.endDate ? new Date(project.endDate) : undefined,
            createdAt: project.createdAt ? new Date(project.createdAt) : undefined,
            updatedAt: project.updatedAt ? new Date(project.updatedAt) : undefined,
          };
          await this.projectsRepository.save(cleanData);
          result.projects++;
        } catch (error) {
          result.errors.push(`项目 ${project.title}: ${error.message}`);
        }
      }
    }

    // 导入新闻
    if (data.tables.news && Array.isArray(data.tables.news)) {
      for (const newsItem of data.tables.news) {
        try {
          const cleanData = {
            ...newsItem,
            publishedAt: newsItem.publishedAt ? new Date(newsItem.publishedAt) : undefined,
            createdAt: newsItem.createdAt ? new Date(newsItem.createdAt) : undefined,
            updatedAt: newsItem.updatedAt ? new Date(newsItem.updatedAt) : undefined,
          };
          await this.newsRepository.save(cleanData);
          result.news++;
        } catch (error) {
          result.errors.push(`新闻 ${newsItem.title}: ${error.message}`);
        }
      }
    }

    // 导入统计数据
    if (data.tables.stats && Array.isArray(data.tables.stats)) {
      for (const stat of data.tables.stats) {
        try {
          const cleanData = {
            ...stat,
            createdAt: stat.createdAt ? new Date(stat.createdAt) : undefined,
            updatedAt: stat.updatedAt ? new Date(stat.updatedAt) : undefined,
          };
          await this.statsRepository.save(cleanData);
          result.stats++;
        } catch (error) {
          result.errors.push(`统计数据 ${stat.id}: ${error.message}`);
        }
      }
    }

    // 导入友情链接
    if (data.tables.friendLinks && Array.isArray(data.tables.friendLinks)) {
      for (const link of data.tables.friendLinks) {
        try {
          const cleanData = {
            ...link,
            createdAt: link.createdAt ? new Date(link.createdAt) : undefined,
            updatedAt: link.updatedAt ? new Date(link.updatedAt) : undefined,
          };
          await this.friendLinksRepository.save(cleanData);
          result.friendLinks++;
        } catch (error) {
          result.errors.push(`友情链接 ${link.name}: ${error.message}`);
        }
      }
    }

    return result;
  }
}
