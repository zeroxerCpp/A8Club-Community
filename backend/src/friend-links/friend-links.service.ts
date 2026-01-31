import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { FriendLink } from '../entities/friend-link.entity'
import { CreateFriendLinkDto, UpdateFriendLinkDto } from './dto/friend-link.dto'

@Injectable()
export class FriendLinksService {
  constructor(
    @InjectRepository(FriendLink)
    private friendLinksRepository: Repository<FriendLink>,
  ) {}

  async findAll(): Promise<FriendLink[]> {
    const links = await this.friendLinksRepository.find()
    return this.sortByOrderIndex(links)
  }

  async findActive(): Promise<FriendLink[]> {
    const links = await this.friendLinksRepository.find({
      where: { isActive: true },
    })
    return this.sortByOrderIndex(links)
  }

  private sortByOrderIndex(items: FriendLink[]): FriendLink[] {
    return items.sort((a, b) => {
      // orderIndex=0 为置顶
      if (a.orderIndex === 0 && b.orderIndex !== 0) return -1
      if (a.orderIndex !== 0 && b.orderIndex === 0) return 1
      if (a.orderIndex === 0 && b.orderIndex === 0) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      // 非置顶按orderIndex排序，再按时间
      if (a.orderIndex !== b.orderIndex) {
        return a.orderIndex - b.orderIndex
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }

  async findOne(id: number): Promise<FriendLink | null> {
    return this.friendLinksRepository.findOne({ where: { id } })
  }

  async create(createDto: CreateFriendLinkDto): Promise<FriendLink> {
    const friendLink = this.friendLinksRepository.create(createDto)
    return this.friendLinksRepository.save(friendLink)
  }

  async update(id: number, updateDto: UpdateFriendLinkDto): Promise<FriendLink | null> {
    await this.friendLinksRepository.update(id, updateDto)
    return this.findOne(id)
  }

  async remove(id: number): Promise<void> {
    await this.friendLinksRepository.delete(id)
  }
}
