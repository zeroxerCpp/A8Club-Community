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

  async exportToSQL(): Promise<string> {
    const data = await this.exportAllData();
    let sql = `-- G8 Community Database Backup\n`;
    sql += `-- Export Date: ${data.exportDate}\n`;
    sql += `-- Version: ${data.version}\n\n`;

    // Founders
    if (data.tables.founders.length > 0) {
      sql += `-- Founders Table\n`;
      for (const founder of data.tables.founders) {
        sql += `INSERT INTO founder (id, name, title, description, avatar_url, order_index, is_active, created_at, updated_at) VALUES (`;
        sql += `${founder.id}, `;
        sql += `'${this.escapeSql(founder.name)}', `;
        sql += `'${this.escapeSql(founder.title)}', `;
        sql += `'${this.escapeSql(founder.description)}', `;
        sql += `'${this.escapeSql(founder.avatarUrl)}', `;
        sql += `${founder.orderIndex}, `;
        sql += `${founder.isActive}, `;
        sql += `'${founder.createdAt.toISOString()}', `;
        sql += `'${founder.updatedAt.toISOString()}');\n`;
      }
      sql += `\n`;
    }

    // Projects
    if (data.tables.projects.length > 0) {
      sql += `-- Projects Table\n`;
      for (const project of data.tables.projects) {
        sql += `INSERT INTO project (id, title, description, image_url, project_url, start_date, end_date, order_index, is_active, created_at, updated_at) VALUES (`;
        sql += `${project.id}, `;
        sql += `'${this.escapeSql(project.title)}', `;
        sql += `'${this.escapeSql(project.description)}', `;
        sql += `'${this.escapeSql(project.imageUrl)}', `;
        sql += `${project.projectUrl ? `'${this.escapeSql(project.projectUrl)}'` : 'NULL'}, `;
        sql += `${project.startDate ? `'${project.startDate.toISOString()}'` : 'NULL'}, `;
        sql += `${project.endDate ? `'${project.endDate.toISOString()}'` : 'NULL'}, `;
        sql += `${project.orderIndex}, `;
        sql += `${project.isActive}, `;
        sql += `'${project.createdAt.toISOString()}', `;
        sql += `'${project.updatedAt.toISOString()}');\n`;
      }
      sql += `\n`;
    }

    // News
    if (data.tables.news.length > 0) {
      sql += `-- News Table\n`;
      for (const newsItem of data.tables.news) {
        sql += `INSERT INTO news (id, title, summary, content, cover_image_url, author, view_count, is_published, published_at, created_at, updated_at) VALUES (`;
        sql += `${newsItem.id}, `;
        sql += `'${this.escapeSql(newsItem.title)}', `;
        sql += `'${this.escapeSql(newsItem.summary)}', `;
        sql += `'${this.escapeSql(newsItem.content)}', `;
        sql += `${newsItem.coverImageUrl ? `'${this.escapeSql(newsItem.coverImageUrl)}'` : 'NULL'}, `;
        sql += `'${this.escapeSql(newsItem.author)}', `;
        sql += `${newsItem.viewCount}, `;
        sql += `${newsItem.isPublished}, `;
        sql += `${newsItem.publishedAt ? `'${newsItem.publishedAt.toISOString()}'` : 'NULL'}, `;
        sql += `'${newsItem.createdAt.toISOString()}', `;
        sql += `'${newsItem.updatedAt.toISOString()}');\n`;
      }
      sql += `\n`;
    }

    // Stats
    if (data.tables.stats.length > 0) {
      sql += `-- Community Stats Table\n`;
      for (const stat of data.tables.stats) {
        sql += `INSERT INTO community_stats (id, label, value, unit, icon, order_index, is_active, created_at, updated_at) VALUES (`;
        sql += `${stat.id}, `;
        sql += `'${this.escapeSql(stat.label)}', `;
        sql += `'${this.escapeSql(stat.value)}', `;
        sql += `${stat.unit ? `'${this.escapeSql(stat.unit)}'` : 'NULL'}, `;
        sql += `${stat.icon ? `'${this.escapeSql(stat.icon)}'` : 'NULL'}, `;
        sql += `${stat.orderIndex}, `;
        sql += `${stat.isActive}, `;
        sql += `'${stat.createdAt.toISOString()}', `;
        sql += `'${stat.updatedAt.toISOString()}');\n`;
      }
      sql += `\n`;
    }

    // Friend Links
    if (data.tables.friendLinks.length > 0) {
      sql += `-- Friend Links Table\n`;
      for (const link of data.tables.friendLinks) {
        sql += `INSERT INTO friend_link (id, name, url, logo_url, description, order_index, is_active, created_at, updated_at) VALUES (`;
        sql += `${link.id}, `;
        sql += `'${this.escapeSql(link.name)}', `;
        sql += `'${this.escapeSql(link.url)}', `;
        sql += `${link.logoUrl ? `'${this.escapeSql(link.logoUrl)}'` : 'NULL'}, `;
        sql += `${link.description ? `'${this.escapeSql(link.description)}'` : 'NULL'}, `;
        sql += `${link.orderIndex}, `;
        sql += `${link.isActive}, `;
        sql += `'${link.createdAt.toISOString()}', `;
        sql += `'${link.updatedAt.toISOString()}');\n`;
      }
      sql += `\n`;
    }

    // Users (不包含密码)
    if (data.tables.users.length > 0) {
      sql += `-- Users Table (passwords excluded)\n`;
      for (const user of data.tables.users) {
        sql += `-- User: ${user.username} (id: ${user.id}) - Password needs to be set manually\n`;
      }
      sql += `\n`;
    }

    return sql;
  }

  private escapeSql(value: string): string {
    if (!value) return '';
    return value.replace(/'/g, "''").replace(/\\/g, '\\\\');
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
    };

    // 导入创始人
    if (data.tables.founders && Array.isArray(data.tables.founders)) {
      for (const founder of data.tables.founders) {
        await this.foundersRepository.save(founder);
        result.founders++;
      }
    }

    // 导入项目
    if (data.tables.projects && Array.isArray(data.tables.projects)) {
      for (const project of data.tables.projects) {
        await this.projectsRepository.save(project);
        result.projects++;
      }
    }

    // 导入新闻
    if (data.tables.news && Array.isArray(data.tables.news)) {
      for (const newsItem of data.tables.news) {
        await this.newsRepository.save(newsItem);
        result.news++;
      }
    }

    // 导入统计数据
    if (data.tables.stats && Array.isArray(data.tables.stats)) {
      for (const stat of data.tables.stats) {
        await this.statsRepository.save(stat);
        result.stats++;
      }
    }

    // 导入友情链接
    if (data.tables.friendLinks && Array.isArray(data.tables.friendLinks)) {
      for (const link of data.tables.friendLinks) {
        await this.friendLinksRepository.save(link);
        result.friendLinks++;
      }
    }

    return result;
  }
}
