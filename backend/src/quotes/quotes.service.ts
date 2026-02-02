import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quote } from '../entities/quote.entity';
import { CreateQuoteDto, UpdateQuoteDto } from './dto/quote.dto';

@Injectable()
export class QuotesService {
  constructor(
    @InjectRepository(Quote)
    private quotesRepository: Repository<Quote>,
  ) {}

  async findAll(
    page?: number,
    limit?: number,
  ): Promise<Quote[] | { items: Quote[]; total: number; page: number; pageSize: number; totalPages: number }> {
    // 如果没有传入分页参数，返回所有数据（向后兼容）
    if (!page || !limit) {
      return await this.quotesRepository.find({
        order: { order: 'ASC', createdAt: 'DESC' },
      });
    }

    // 分页查询
    const skip = (page - 1) * limit;
    const [items, total] = await this.quotesRepository.findAndCount({
      order: { order: 'ASC', createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      items,
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Quote | null> {
    return await this.quotesRepository.findOne({ where: { id } });
  }

  async create(createQuoteDto: CreateQuoteDto): Promise<Quote> {
    const quote = this.quotesRepository.create(createQuoteDto);
    return await this.quotesRepository.save(quote);
  }

  async update(id: number, updateQuoteDto: UpdateQuoteDto): Promise<Quote | null> {
    await this.quotesRepository.update(id, updateQuoteDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.quotesRepository.delete(id);
  }

  async removeAll(): Promise<{ count: number }> {
    const count = await this.quotesRepository.count();
    await this.quotesRepository.clear();
    return { count };
  }

  async batchImport(data: {
    content: string;
    author: string;
    publishDate?: string;
    context?: string;
  }): Promise<{ success: number; failed: number; quotes: Quote[] }> {
    // 用空行分割语录（\n\n 或 \r\n\r\n）
    const paragraphs = data.content
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const quotes: Quote[] = [];
    let successCount = 0;
    let failedCount = 0;

    // 批量创建语录
    for (let i = 0; i < paragraphs.length; i++) {
      try {
        const quote = this.quotesRepository.create({
          content: paragraphs[i],
          author: data.author,
          publishDate: data.publishDate,
          context: data.context,
          order: i,
        });
        const savedQuote = await this.quotesRepository.save(quote);
        quotes.push(savedQuote);
        successCount++;
      } catch (error) {
        failedCount++;
        console.error(`导入第 ${i + 1} 条语录失败:`, error);
      }
    }

    return {
      success: successCount,
      failed: failedCount,
      quotes,
    };
  }
}
