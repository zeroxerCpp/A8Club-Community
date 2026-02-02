import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tool } from '../entities/tool.entity';
import { CreateToolDto, UpdateToolDto } from './dto/tool.dto';

@Injectable()
export class ToolsService {
  constructor(
    @InjectRepository(Tool)
    private toolsRepository: Repository<Tool>,
  ) {}

  async findAll(): Promise<Tool[]> {
    return await this.toolsRepository.find({
      order: { order: 'ASC', createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Tool | null> {
    return await this.toolsRepository.findOne({ where: { id } });
  }

  async create(createToolDto: CreateToolDto): Promise<Tool> {
    const tool = this.toolsRepository.create(createToolDto);
    return await this.toolsRepository.save(tool);
  }

  async update(id: number, updateToolDto: UpdateToolDto): Promise<Tool | null> {
    await this.toolsRepository.update(id, updateToolDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.toolsRepository.delete(id);
  }
}
