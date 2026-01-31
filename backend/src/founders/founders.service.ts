import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Founder } from '../entities/founder.entity';
import { CreateFounderDto, UpdateFounderDto } from './dto/founder.dto';

@Injectable()
export class FoundersService {
  constructor(
    @InjectRepository(Founder)
    private founderRepository: Repository<Founder>,
  ) {}

  async create(createFounderDto: CreateFounderDto): Promise<Founder> {
    const founder = this.founderRepository.create(createFounderDto);
    return await this.founderRepository.save(founder);
  }

  async findAll(): Promise<Founder[]> {
    return await this.founderRepository.find({
      order: { orderIndex: 'ASC', createdAt: 'ASC' },
    });
  }

  async findActive(): Promise<Founder[]> {
    return await this.founderRepository.find({
      where: { isActive: true },
      order: { orderIndex: 'ASC', createdAt: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Founder> {
    const founder = await this.founderRepository.findOne({ where: { id } });
    if (!founder) {
      throw new NotFoundException(`创始人 #${id} 未找到`);
    }
    return founder;
  }

  async update(id: number, updateFounderDto: UpdateFounderDto): Promise<Founder> {
    const founder = await this.findOne(id);
    Object.assign(founder, updateFounderDto);
    return await this.founderRepository.save(founder);
  }

  async remove(id: number): Promise<void> {
    const founder = await this.findOne(id);
    await this.founderRepository.remove(founder);
  }
}
