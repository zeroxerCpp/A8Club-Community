import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from '../entities/news.entity';
import { CreateNewsDto, UpdateNewsDto } from './dto/news.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
  ) {}

  async create(createNewsDto: CreateNewsDto): Promise<News> {
    const news = this.newsRepository.create(createNewsDto);
    if (news.isPublished && !news.publishedAt) {
      news.publishedAt = new Date();
    }
    return await this.newsRepository.save(news);
  }

  async findAll(): Promise<News[]> {
    const news = await this.newsRepository.find();
    return this.sortByOrderIndex(news);
  }

  async findPublished(): Promise<News[]> {
    const news = await this.newsRepository.find({
      where: { isPublished: true },
    });
    return this.sortByOrderIndex(news);
  }

  private sortByOrderIndex(items: News[]): News[] {
    return items.sort((a, b) => {
      // orderIndex=0 为置顶
      if (a.orderIndex === 0 && b.orderIndex !== 0) return -1;
      if (a.orderIndex !== 0 && b.orderIndex === 0) return 1;
      if (a.orderIndex === 0 && b.orderIndex === 0) {
        return new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime();
      }
      // 非置顶按orderIndex排序，再按时间
      if (a.orderIndex !== b.orderIndex) {
        return a.orderIndex - b.orderIndex;
      }
      return new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime();
    });
  }

  async findOne(id: number): Promise<News> {
    const news = await this.newsRepository.findOne({ where: { id } });
    if (!news) {
      throw new NotFoundException(`新闻 #${id} 未找到`);
    }
    return news;
  }

  async update(id: number, updateNewsDto: UpdateNewsDto): Promise<News> {
    const news = await this.findOne(id);
    
    // 如果从未发布变为发布,设置发布时间
    if (updateNewsDto.isPublished && !news.isPublished) {
      news.publishedAt = new Date();
    }
    
    Object.assign(news, updateNewsDto);
    return await this.newsRepository.save(news);
  }

  async remove(id: number): Promise<void> {
    const news = await this.findOne(id);
    await this.newsRepository.remove(news);
  }
}
