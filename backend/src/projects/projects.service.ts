import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.projectRepository.create(createProjectDto);
    return await this.projectRepository.save(project);
  }

  async findAll(): Promise<Project[]> {
    const projects = await this.projectRepository.find();
    return this.sortByOrderIndex(projects);
  }

  async findActive(): Promise<Project[]> {
    const projects = await this.projectRepository.find({
      where: { isActive: true },
    });
    return this.sortByOrderIndex(projects);
  }

  private sortByOrderIndex(items: Project[]): Project[] {
    return items.sort((a, b) => {
      // orderIndex=0 为置顶
      if (a.orderIndex === 0 && b.orderIndex !== 0) return -1;
      if (a.orderIndex !== 0 && b.orderIndex === 0) return 1;
      if (a.orderIndex === 0 && b.orderIndex === 0) {
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      }
      // 非置顶按orderIndex排序，再按开始时间
      if (a.orderIndex !== b.orderIndex) {
        return a.orderIndex - b.orderIndex;
      }
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException(`项目 #${id} 未找到`);
    }
    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);
    Object.assign(project, updateProjectDto);
    return await this.projectRepository.save(project);
  }

  async remove(id: number): Promise<void> {
    const project = await this.findOne(id);
    await this.projectRepository.remove(project);
  }
}
